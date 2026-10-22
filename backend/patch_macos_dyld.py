"""
Utility to fix macOS dyld zero-fill section header bug:
'section __DATA/__thread_bss has a zero-fill section type, but offset field is not zero'

This affects older/pre-built Mach-O arm64 binaries (e.g. in scipy and cv2) on newer macOS versions.
"""

import os
import struct
import subprocess
import sys


def patch_macho_zero_fill_sections(venv_path: str):
    LC_SEGMENT_64 = 0x19
    patched = 0

    for root, _, files in os.walk(venv_path):
        for f in files:
            if not f.endswith((".so", ".dylib")):
                continue

            filepath = os.path.join(root, f)
            try:
                with open(filepath, "rb") as fp:
                    data = bytearray(fp.read())

                if len(data) < 32:
                    continue

                magic = struct.unpack_from("<I", data, 0)[0]
                if magic != 0xFEEDFACF:  # 64-bit Mach-O little-endian
                    continue

                ncmds = struct.unpack_from("<I", data, 16)[0]
                offset = 32
                modified = False

                for _ in range(ncmds):
                    if offset + 8 > len(data):
                        break
                    cmd, cmdsize = struct.unpack_from("<II", data, offset)
                    if cmd == LC_SEGMENT_64:
                        nsects = struct.unpack_from("<I", data, offset + 64)[0]
                        sect_offset = offset + 72
                        for _ in range(nsects):
                            if sect_offset + 80 > len(data):
                                break
                            s_off = struct.unpack_from("<I", data, sect_offset + 48)[0]
                            s_flags = struct.unpack_from("<I", data, sect_offset + 64)[0]
                            sect_type = s_flags & 0xFF

                            # S_ZEROFILL (0x1) or S_THREAD_LOCAL_ZEROFILL (0x12)
                            if sect_type in (0x1, 0x12) and s_off != 0:
                                struct.pack_into("<I", data, sect_offset + 48, 0)
                                modified = True

                            sect_offset += 80
                    offset += cmdsize

                if modified:
                    with open(filepath, "wb") as fp:
                        fp.write(data)
                    subprocess.run(
                        ["codesign", "--force", "--sign", "-", filepath],
                        check=True,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                    patched += 1
                    print(f"Patched & codesigned: {filepath}")

            except Exception as e:
                print(f"Skipping {filepath}: {e}", file=sys.stderr)

    print(f"Done. Patched {patched} binary file(s).")


if __name__ == "__main__":
    venv_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", ".venv")
    venv_dir = os.path.abspath(venv_dir)
    print(f"Scanning virtualenv at: {venv_dir}")
    patch_macho_zero_fill_sections(venv_dir)
