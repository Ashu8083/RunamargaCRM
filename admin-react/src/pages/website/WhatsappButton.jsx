export default function WhatsAppButton() {

  const phoneNumber = "918147740043";
  const message = "Hi, I want to know more about loans";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-14 h-14 hover:scale-110 transition-transform duration-300"
      />
    </a>
  );
}