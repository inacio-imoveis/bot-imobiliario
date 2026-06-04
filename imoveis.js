/**
 * imoveis.js
 * Catálogo de empreendimentos e unidades disponíveis.
 * Edite este arquivo para atualizar disponibilidade e preços.
 */

export const catalog = {
  construtora: {
    nome: "nome: "Ricardo Inácio Imóveis",
    cidade: "Goiânia/GO",
    whatsapp: "5562XXXXXXXXX",
    site: "www.suaconstrutora.com.br",
  },

  empreendimentos: [
    {
      id: "monte-pascoal",
      nome: "Residencial Monte Pascoal",
      tipo: "Casa",
      bairro: "Goiânia/GO",
      endereco: "Rua RM-19, Lote 35, Quadra 18 — CEP 74494-480",
      status: "Em entrega",
      programa: "Minha Casa Minha Vida",
      descricao:
        "Residencial com casas individuais, entregues com documentação completa e financiamento Caixa Econômica Federal aprovado.",
      unidades: [
        {
          id: "casa-01",
          nome: "Casa nº 01",
          status: "Reservada",
          area: "48m²",
          quartos: 2,
          banheiros: 1,
          vagas: 1,
          preco: null, // reservada
          matricula: "417.181",
        },
        {
          id: "casa-02",
          nome: "Casa nº 02",
          status: "Disponível",
          area: "48m²",
          quartos: 2,
          banheiros: 1,
          vagas: 1,
          preco: 185000,
          matricula: "417.182",
        },
        {
          id: "casa-03",
          nome: "Casa nº 03",
          status: "Disponível",
          area: "52m²",
          quartos: 2,
          banheiros: 2,
          vagas: 1,
          preco: 198000,
          matricula: "417.183",
        },
      ],
      diferenciais: [
        "Documentação 100% regularizada",
        "Aceita FGTS e financiamento Caixa",
        "Área murada e portão individual",
        "Próximo a escolas e comércio",
      ],
    },

    // ── Adicione mais empreendimentos aqui ─────────────────────────────────────
    // {
    //   id: "residencial-2",
    //   nome: "Residencial XYZ",
    //   ...
    // },
  ],
};

/**
 * Formata o catálogo como texto para o prompt do Claude.
 */
export function formatCatalogForPrompt(catalog) {
  const lines = [
    `CONSTRUTORA: ${catalog.construtora.nome} — ${catalog.construtora.cidade}`,
    "",
    "=== EMPREENDIMENTOS DISPONÍVEIS ===",
    "",
  ];

  for (const emp of catalog.empreendimentos) {
    lines.push(`📍 ${emp.nome} (${emp.tipo}) — ${emp.bairro}`);
    lines.push(`   Endereço: ${emp.endereco}`);
    lines.push(`   Status: ${emp.status} | Programa: ${emp.programa}`);
    lines.push(`   ${emp.descricao}`);
    lines.push("   Unidades:");

    for (const u of emp.unidades) {
      const preco = u.preco
        ? `R$ ${u.preco.toLocaleString("pt-BR")}`
        : "Sob consulta";
      lines.push(
        `     • ${u.nome} — ${u.area}, ${u.quartos} qts, ${u.banheiros} bnh, ${u.vagas} vaga — ${u.status} — ${preco}`
      );
    }

    lines.push("   Diferenciais: " + emp.diferenciais.join(" | "));
    lines.push("");
  }

  return lines.join("\n");
}
