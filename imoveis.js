export const catalog = {
  construtora: {
    nome: "Ricardo Inácio Imóveis",
    cidade: "Goiânia/GO",
    whatsapp: "5562992786934",
    site: "www.ricardoinacio.com.br",
    instagram: "@ricardoinacioimoveis",
  },

  empreendimentos: [
    {
      id: "mega-quintal-della-penna",
      nome: "Casa 2 Quartos com Mega Quintal — Della Penna",
      tipo: "Casa",
      bairro: "Setor Della Penna / Região da Eternit",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 2 quartos com mega quintal no Setor Della Penna, na Região da Eternit. Excelente localização, a 9 min do Shopping Plaza D'Oro.",
      entrada: 56000,
      rendaMinima: 7000,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Mega quintal", "Aceita FGTS", "9 min do Shopping Plaza D'Oro", "Ótima localização"],
    },
    {
      id: "della-penna-entrada-10",
      nome: "Casa 2 Quartos — Della Penna",
      tipo: "Casa",
      bairro: "Setor Della Penna / Região do Anel Viário",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 2 quartos com quintal no Della Penna, a 9 min do Shopping Plaza D'Oro. Entrada acessível a partir de R$10 mil.",
      entrada: 10000,
      rendaMinima: 7000,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Quintal", "Entrada a partir de R$10mil", "9 min do Shopping Plaza D'Oro", "Aceita FGTS"],
    },
    {
      id: "moinho-ventos-santa-fe",
      nome: "Casa 2 Quartos — Moinho dos Ventos / Santa Fé",
      tipo: "Casa",
      bairro: "Setor Santa Fé / Próximo ao Moinho dos Ventos",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 2 quartos próxima ao Moinho dos Ventos no Setor Santa Fé.",
      entrada: 35000,
      rendaMinima: 8000,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Próxima ao Moinho dos Ventos", "Aceita FGTS", "Ótima localização"],
    },
    {
      id: "monte-pascoal",
      nome: "Casa 2 Quartos — Residencial Monte Pascoal",
      tipo: "Casa",
      bairro: "Goiânia/GO",
      endereco: "Rua RM-19, Lote 35, Quadra 18 — CEP 74494-480",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 2 quartos com mega quintal no Monte Pascoal, a 10 min do Shopping América. Documentação 100% regularizada.",
      entrada: 50000,
      rendaMinima: 7000,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Mega quintal", "10 min do Shopping América", "Documentação regularizada", "Aceita FGTS"],
    },
    {
      id: "setor-nacoes",
      nome: "Casa 2 Quartos — Setor das Nações",
      tipo: "Casa",
      bairro: "Setor das Nações",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa usada, 2 quartos, sala integrada, cozinha americana, banheiro social, garagem e quintal. A 10 min do Shopping Cidade Jardim.",
      entrada: 64000,
      rendaMinima: 7000,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Sala integrada", "Cozinha americana", "Garagem", "Quintal", "10 min do Shopping Cidade Jardim"],
    },
    {
      id: "carolina-parque",
      nome: "Casa 2 Quartos — Setor Carolina Parque",
      tipo: "Casa",
      bairro: "Setor Carolina Parque / Lado do João Braz",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 2 quartos no Setor Carolina Parque, a 10 min do Shopping Cidade Jardim.",
      entrada: null,
      rendaMinima: null,
      aceitaFGTS: true,
      quartos: 2,
      diferenciais: ["Próximo a comércios e serviços", "10 min do Shopping Cidade Jardim", "Aceita FGTS"],
    },
    {
      id: "noroeste-3q",
      nome: "Casa 3 Quartos — Região Noroeste",
      tipo: "Casa",
      bairro: "Região Noroeste",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 3 quartos na Região Noroeste, ao lado do Supermercado Atacadão e 5 min do Portal Shopping.",
      entrada: 15000,
      rendaMinima: 8000,
      aceitaFGTS: true,
      quartos: 3,
      diferenciais: ["3 quartos", "Ao lado do Atacadão", "5 min do Portal Shopping", "Aceita FGTS"],
    },
    {
      id: "pilar-sonhos-3q",
      nome: "Casa 3 Quartos — Setor Pilar dos Sonhos",
      tipo: "Casa",
      bairro: "Setor Pilar dos Sonhos / Região Noroeste",
      status: "Disponível",
      programa: "Minha Casa Minha Vida",
      descricao: "Casa 3 quartos no Setor Pilar dos Sonhos, casa completa, moderna e com excelente acabamento na Região Noroeste.",
      entrada: 20000,
      rendaMinima: 8000,
      aceitaFGTS: true,
      quartos: 3,
      diferenciais: ["3 quartos", "Casa moderna", "Excelente acabamento", "Quintal amplo", "Aceita FGTS"],
    },
  ],
};

export function formatCatalogForPrompt(catalog) {
  const lines = [
    `IMOBILIÁRIA: ${catalog.construtora.nome} — ${catalog.construtora.cidade}`,
    `WhatsApp: ${catalog.construtora.whatsapp} | Instagram: ${catalog.construtora.instagram}`,
    "",
    "=== IMÓVEIS DISPONÍVEIS ===",
    "",
  ];

  for (const emp of catalog.empreendimentos) {
    const entrada = emp.entrada
      ? `R$ ${emp.entrada.toLocaleString("pt-BR")}`
      : "Consultar";
    const renda = emp.rendaMinima
      ? `R$ ${emp.rendaMinima.toLocaleString("pt-BR")}`
      : "Consultar";

    lines.push(`🏠 ${emp.nome}`);
    lines.push(`   📍 ${emp.bairro}`);
    lines.push(`   ${emp.descricao}`);
    lines.push(`   💰 Entrada a partir de: ${entrada}`);
    lines.push(`   👨‍👩‍👧 Renda mínima: ${renda}`);
    lines.push(`   ${emp.aceitaFGTS ? "✅ Aceita FGTS" : ""} | Programa: ${emp.programa}`);
    lines.push(`   ⭐ Diferenciais: ${emp.diferenciais.join(" | ")}`);
    lines.push("");
  }

  return lines.join("\n");
}
