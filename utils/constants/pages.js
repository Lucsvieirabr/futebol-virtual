export const PAGE_USUARIOS = {
  path: "/sistema/controle-acesso/usuarios",
  roles: {
    listar: "usuarios-listar",
    visualizar: "usuarios-visualizar",
    criar: "usuarios-criar",
    editar: "usuarios-editar",
    excluir: "usuarios-excluir",
    "associar-grupo": "usuarios-associar-grupo",
    "desassociar-grupo": "usuarios-desassociar-grupo",
    "associar-organizacao": "usuarios-associar-organizacao",
    "desassociar-organizacao": "usuarios-desassociar-organizacao",
  },
};

export const PAGE_GRUPOS = {
  path: "/sistema/controle-acesso/grupos",
  roles: {
    listar: "grupos-listar",
    visualizar: "grupos-visualizar",
    criar: "grupos-criar",
    editar: "grupos-editar",
    excluir: "grupos-excluir",
    "associar-usuario": "grupos-associar-usuario",
    "desassociar-usuario": "grupos-desassociar-usuario",
    "associar-permissao": "grupos-associar-permissao",
    "desassociar-permissao": "grupos-desassociar-permissao",
  },
};

export const PAGE_ORGANIZACOES = {
  path: "/sistema/controle-acesso/organizacoes",
  roles: {
    listar: "organizacoes-listar",
    visualizar: "organizacoes-visualizar",
    criar: "organizacoes-criar",
    editar: "organizacoes-editar",
    excluir: "organizacoes-excluir",
    "associar-usuario": "organizacoes-associar-usuario",
    "desassociar-usuario": "organizacoes-desassociar-usuario",
  },
};

export const PAGE_PERMISSOES = {
  path: "/sistema/controle-acesso/permissoes",
  roles: {
    listar: "permissoes-listar",
    visualizar: "permissoes-visualizar",
    criar: "permissoes-criar",
    editar: "permissoes-editar",
    excluir: "permissoes-excluir",
    "associar-grupo": "permissoes-associar-grupo",
    "desassociar-grupo": "permissoes-desassociar-grupo",
  },
};

export const PAGE_PAISES = {
  path: "/sistema/cadastro-geral/paises",
  roles: {
    listar: "paises-listar",
    visualizar: "paises-visualizar",
    criar: "paises-criar",
    editar: "paises-editar",
    excluir: "paises-excluir",
  },
};

export const PAGE_ESTADOS = {
  path: "/sistema/cadastro-geral/estados",
  roles: {
    listar: "estados-listar",
    visualizar: "estados-visualizar",
    criar: "estados-criar",
    editar: "estados-editar",
    excluir: "estados-excluir",
  },
};

export const PAGE_CIDADES = {
  path: "/sistema/cadastro-geral/cidades",
  roles: {
    listar: "cidades-listar",
    visualizar: "cidades-visualizar",
    criar: "cidades-criar",
    editar: "cidades-editar",
    excluir: "cidades-excluir",
  },
};

export const PAGE_PESSOAS = {
  path: "/sistema/cadastro/pessoas",
  roles: {
    listar: "pessoas-listar",
    visualizar: "pessoas-visualizar",
    criar: "pessoas-criar",
    editar: "pessoas-editar",
    excluir: "pessoas-excluir",
  },
};

export const PAGE_PESSOAS_CONTATOS = {
  path: "/sistema/cadastro/pessoas",
  roles: {
    listar: "pessoas-contatos-listar",
    visualizar: "pessoas-contatos-visualizar",
    criar: "pessoas-contatos-criar",
    editar: "pessoas-contatos-editar",
    excluir: "pessoas-contatos-excluir",
  },
};

export const PAGE_PESSOAS_ENDERECOS = {
  path: "/sistema/cadastro/pessoas",
  roles: {
    listar: "pessoas-enderecos-listar",
    visualizar: "pessoas-enderecos-visualizar",
    criar: "pessoas-enderecos-criar",
    editar: "pessoas-enderecos-editar",
    excluir: "pessoas-enderecos-excluir",
  },
};

export const PAGE_PRODUTOS = {
  path: "/sistema/cadastro/produtos",
  roles: {
    listar: "produtos-listar",
    visualizar: "produtos-visualizar",
    criar: "produtos-criar",
    editar: "produtos-editar",
    excluir: "produtos-excluir",
  },
};

export const PAGE_PRODUTOS_CATEGORIAS = {
  path: "/sistema/cadastro/produtos-categorias",
  roles: {
    listar: "produtos-categorias-listar",
    visualizar: "produtos-categorias-visualizar",
    criar: "produtos-categorias-criar",
    editar: "produtos-categorias-editar",
    excluir: "produtos-categorias-excluir",
  },
};

export const PAGE_PEDIDOS = {
  path: "/sistema/cadastro/pedidos",
  roles: {
    listar: "pedidos-listar",
    visualizar: "pedidos-visualizar",
    criar: "pedidos-criar",
    editar: "pedidos-editar",
    excluir: "pedidos-excluir",
  },
};

export const PAGE_CONTAS = {
  path: "/sistema/financeiro/contas",
  roles: {
    listar: "contas-listar",
    visualizar: "contas-visualizar",
    criar: "contas-criar",
    editar: "contas-editar",
    excluir: "contas-excluir",
  },
};

export const PAGE_TRANSACOES_CATEGORIAS = {
  path: "/sistema/financeiro/transacoes-categorias",
  roles: {
    listar: "transacoes-categorias-listar",
    visualizar: "transacoes-categorias-visualizar",
    criar: "transacoes-categorias-criar",
    editar: "transacoes-categorias-editar",
    excluir: "transacoes-categorias-excluir",
  },
};

export const PAGE_TRANSACOES = {
  path: "/sistema/financeiro/transacoes",
  roles: {
    listar: "transacoes-listar",
    visualizar: "transacoes-visualizar",
    criar: "transacoes-criar",
    editar: "transacoes-editar",
    excluir: "transacoes-excluir",
  },
};

export const PAGE_FORMAS_PAGAMENTOS = {
  path: "/sistema/cadastro-geral/formas-pagamentos",
  roles: {
    listar: "formas-pagamentos-listar",
    visualizar: "formas-pagamentos-visualizar",
    criar: "formas-pagamentos-criar",
    editar: "formas-pagamentos-editar",
    excluir: "formas-pagamentos-excluir",
  },
};

export const PAGE_FATURAS = {
  path: "/sistema/financeiro/faturas",
  roles: {
    listar: "faturas-listar",
    visualizar: "faturas-visualizar",
    criar: "faturas-criar",
    editar: "faturas-editar",
    excluir: "faturas-excluir",
  },
};

export const PAGE_ASSINATURAS = {
  path: "/sistema/cadastro-geral/assinatura",
  roles: {
    listar: "assinaturas-listar",
    visualizar: "assinaturas-visualizar",
    criar: "assinaturas-criar",
    editar: "assinaturas-editar",
    excluir: "assinaturas-excluir",
  },
};


export const PAGE_PLANOS = {
  path: "/sistema/cadastro-geral/planos",
  roles: {
    listar: "planos-listar",
    visualizar: "planos-visualizar",
    criar: "planos-criar",
    editar: "planos-editar",
    excluir: "planos-excluir",
  },
};

export const PAGE_CUPONS = {
  'path': '/sistema/cadastro/cupons',
  'roles': {
      'criar': 'cupons-criar',
      'buscar': 'cupons-listar',
      'editar': 'cupons-editar',
      'excluir': 'cupons-excluir',
      'visualizar': 'cupons-visualizar',
  },
};

export const PAGE_CARRINHOS = {
  'path': '/cart',
  'roles': {
      'criar': 'carrinhos-criar',
      'buscar': 'carrinhos-listar',
      'editar': 'carrinhos-editar',
      'excluir': 'carrinhos-excluir',
      'visualizar': 'carrinhos-visualizar',
  },
};