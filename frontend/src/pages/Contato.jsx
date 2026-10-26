import PageSection from "../components/PageSection";

function Contato() {
  return (
    <PageSection eyebrow="Atendimento" title="Entre em contato" description="Estamos aqui para ajudar com dúvidas, sugestões e orientações personalizadas." id="contact-page">
      <form className="form-card">
        <label>
          Nome
          <input type="text" name="name" placeholder="Seu nome" />
        </label>
        <label>
          E-mail
          <input type="email" name="email" placeholder="seu@email.com" />
        </label>
        <label>
          Mensagem
          <textarea name="message" rows="5" placeholder="Escreva sua mensagem" />
        </label>
        <button type="submit" className="button button--primary">
          Enviar
        </button>
      </form>
    </PageSection>
  );
}

export default Contato;
