// pages/api/cep/[cep].js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { cep } = req.query;

  // Validar formato do CEP
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return res.status(400).json({ error: 'CEP deve ter 8 dígitos' });
  }

  try {
    // Buscar no ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao consultar CEP');
    }

    const data = await response.json();

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    // Retornar dados formatados
    return res.status(200).json({
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi
    });

  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

