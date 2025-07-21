// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nem.com.br' },
    update: {},
    create: {
      email: 'admin@nem.com.br',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário admin criado:', admin.email);

  // Criar categorias
  const categories = [
    {
      name: 'Dicas de Moda',
      slug: 'dicas',
      description: 'Dicas e truques de moda para o dia a dia',
    },
    {
      name: 'Tendências',
      slug: 'tendencias',
      description: 'As últimas tendências da moda feminina',
    },
    {
      name: 'Novidades',
      slug: 'novidades',
      description: 'Novidades da loja e lançamentos',
    },
    {
      name: 'Entrevistas',
      slug: 'entrevistas',
      description: 'Entrevistas exclusivas com personalidades da moda',
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log('✅ Categoria criada:', category.name);
  }

  // Criar tags
  const tags = [
    { name: 'Estilo', slug: 'estilo' },
    { name: 'Casual', slug: 'casual' },
    { name: 'Elegante', slug: 'elegante' },
    { name: 'Verão', slug: 'verao' },
    { name: 'Inverno', slug: 'inverno' },
    { name: 'Acessórios', slug: 'acessorios' },
    { name: 'Cores', slug: 'cores' },
    { name: 'Combinações', slug: 'combinacoes' },
  ];

  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    console.log('✅ Tag criada:', tag.name);
  }

  // Buscar categorias e tags criadas
  const dicasCategory = await prisma.category.findUnique({ where: { slug: 'dicas' } });
  const tendenciasCategory = await prisma.category.findUnique({ where: { slug: 'tendencias' } });
  const novidadesCategory = await prisma.category.findUnique({ where: { slug: 'novidades' } });
  
  const estiloTag = await prisma.tag.findUnique({ where: { slug: 'estilo' } });
  const casualTag = await prisma.tag.findUnique({ where: { slug: 'casual' } });
  const verao = await prisma.tag.findUnique({ where: { slug: 'verao' } });

  // Criar posts de exemplo
  const posts = [
    {
      title: 'Como Criar Looks Casuais Elegantes para o Dia a Dia',
      slug: 'looks-casuais-elegantes-dia-a-dia',
      excerpt: 'Descubra como combinar peças básicas para criar looks casuais mas elegantes, perfeitos para qualquer ocasião do dia a dia.',
      content: `
# Como Criar Looks Casuais Elegantes para o Dia a Dia

O segredo para um visual casual elegante está na escolha das peças certas e na forma como você as combina. Aqui estão algumas dicas essenciais:

## 1. Invista em Peças Básicas de Qualidade

- **Camisetas bem cortadas**: Escolha tecidos que não deformem
- **Calças jeans escuras**: Mais versáteis e elegantes
- **Blazers estruturados**: Elevam qualquer look casual

## 2. Acessórios Fazem a Diferença

Os acessórios são capazes de transformar um look básico em algo especial:

- Bolsas de couro ou sintético de qualidade
- Sapatos confortáveis mas estilosos
- Joias delicadas que complementam sem exagerar

## 3. Cores Neutras São Suas Aliadas

Aposte em uma paleta de cores neutras como base:
- Preto, branco, bege, cinza
- Adicione uma cor vibrante como ponto focal

## 4. Tecidos e Texturas

Misture texturas diferentes para criar interesse visual:
- Combine algodão com couro
- Misture malha com tecidos estruturados

## Conclusão

Lembre-se: elegância não está no preço das peças, mas na forma como você as combina e na confiança com que as usa.
      `,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      categoryId: dicasCategory.id,
      authorId: admin.id,
      tags: [estiloTag.id, casualTag.id],
    },
    {
      title: 'Tendências de Verão 2024: O Que Vai Bombar',
      slug: 'tendencias-verao-2024',
      excerpt: 'Confira as principais tendências de moda para o verão 2024 e saiba como incorporá-las no seu guarda-roupa.',
      content: `
# Tendências de Verão 2024: O Que Vai Bombar

O verão 2024 promete ser cheio de cores vibrantes, estampas ousadas e muito conforto. Vamos descobrir juntas o que estará em alta:

## 1. Cores Vibrantes

Este verão é sobre expressar alegria através das cores:
- **Laranja vibrante**: A cor do momento
- **Verde limão**: Fresco e energizante  
- **Rosa shocking**: Para quem não tem medo de ousar

## 2. Estampas Tropicais

As estampas tropicais voltaram com tudo:
- Folhagens exuberantes
- Flores grandes e coloridas
- Motivos de frutas tropicais

## 3. Tecidos Leves e Fluidos

O conforto é prioridade:
- Linho natural
- Algodão orgânico
- Viscose fluida

## 4. Cortes Relaxados

- Vestidos midi soltos
- Calças wide leg
- Blusas oversized

## Como Usar

Não precisa aderir a todas as tendências de uma vez. Escolha uma ou duas que mais combinam com seu estilo e incorpore gradualmente.
      `,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-10'),
      categoryId: tendenciasCategory.id,
      authorId: admin.id,
      tags: [verao.id, estiloTag.id],
    },
    {
      title: 'Nova Coleção Nem: Primavera/Verão 2024',
      slug: 'nova-colecao-nem-primavera-verao-2024',
      excerpt: 'Conheça em primeira mão as novidades da nossa coleção Primavera/Verão 2024, com peças que combinam estilo e conforto.',
      content: `
# Nova Coleção Nem: Primavera/Verão 2024

Estamos muito animadas para apresentar nossa nova coleção! Desenvolvida com muito carinho, cada peça foi pensada para a mulher moderna que busca estilo sem abrir mão do conforto.

## Destaques da Coleção

### Vestidos Fluidos
Nossa linha de vestidos traz cortes que valorizam todos os tipos de corpo, com tecidos leves e estampas exclusivas.

### Conjuntos Coordenados
Para quem ama praticidade, criamos conjuntos que podem ser usados juntos ou separados, multiplicando as possibilidades do seu guarda-roupa.

### Acessórios Especiais
Complementamos a coleção com bolsas, cintos e bijuterias que harmonizam perfeitamente com as roupas.

## Sustentabilidade

Continuamos nosso compromisso com a moda sustentável:
- Tecidos eco-friendly
- Produção local
- Embalagens recicláveis

## Disponibilidade

A coleção já está disponível em nossa loja física e online. Não perca!
      `,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-05'),
      categoryId: novidadesCategory.id,
      authorId: admin.id,
      tags: [estiloTag.id],
    },
  ];

  for (const postData of posts) {
    const { tags, ...postWithoutTags } = postData;
    
    const post = await prisma.post.create({
      data: {
        ...postWithoutTags,
        tags: {
          connect: tags.map(tagId => ({ id: tagId })),
        },
      },
    });
    console.log('✅ Post criado:', post.title);
  }

  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('📧 Credenciais do admin:');
  console.log('Email: admin@nem.com.br');
  console.log('Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

