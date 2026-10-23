
import asyncio


class RequestGate:
    """Limit concurrent HTTP requests and reserve capacity for admin APIs."""

    def __init__(
        self,
        max_concurrent: int = 12,
        reserved_admin: int = 3,
        max_waiting: int = 50,
        reserved_admin_waiting: int = 10,
        wait_timeout: float = 5.0,
    ):
        if not 0 < reserved_admin < max_concurrent:
            raise ValueError(
                "reserved_admin must be between 1 and max_concurrent - 1"
            )

        if not 0 <= reserved_admin_waiting < max_waiting:
            raise ValueError(
                "reserved_admin_waiting must be less than max_waiting"
            )

        self.max_concurrent = max_concurrent
        self.reserved_admin = reserved_admin
        self.max_waiting = max_waiting
        self.reserved_admin_waiting = reserved_admin_waiting
        self.wait_timeout = wait_timeout

        self._condition = asyncio.Condition()
        self._active_total = 0
        self._active_normal = 0
        self._waiting_admin = 0
        self._waiting_normal = 0

    def _can_enter(self, is_admin: bool) -> bool:
        if self._active_total >= self.max_concurrent:
            return False

        if is_admin:
            return True

        normal_limit = self.max_concurrent - self.reserved_admin

        return (
            self._active_normal < normal_limit
            and self._waiting_admin == 0
        )

    async def acquire(self, is_admin: bool) -> bool:
        async with self._condition:
            if self._can_enter(is_admin):
                self._active_total += 1

                if not is_admin:
                    self._active_normal += 1

                return True

            total_waiting = (
                self._waiting_admin + self._waiting_normal
            )

            if total_waiting >= self.max_waiting:
                return False

            if not is_admin:
                normal_queue_limit = (
                    self.max_waiting - self.reserved_admin_waiting
                )

                if self._waiting_normal >= normal_queue_limit:
                    return False

            if is_admin:
                self._waiting_admin += 1
            else:
                self._waiting_normal += 1

            try:
                await asyncio.wait_for(
                    self._condition.wait_for(
                        lambda: self._can_enter(is_admin)
                    ),
                    timeout=self.wait_timeout,
                )
            except asyncio.TimeoutError:
                if is_admin:
                    self._waiting_admin -= 1
                else:
                    self._waiting_normal -= 1

                self._condition.notify_all()
                return False
            except BaseException:
                if is_admin:
                    self._waiting_admin -= 1
                else:
                    self._waiting_normal -= 1

                self._condition.notify_all()
                raise

            if is_admin:
                self._waiting_admin -= 1
            else:
                self._waiting_normal -= 1

            self._active_total += 1

            if not is_admin:
                self._active_normal += 1

            self._condition.notify_all()
            return True

    async def release(self, is_admin: bool) -> None:
        async with self._condition:
            self._active_total -= 1

            if not is_admin:
                self._active_normal -= 1

            self._condition.notify_all()


request_gate = RequestGate()
