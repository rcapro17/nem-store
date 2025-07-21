// pages/api/blog/posts/[slug].js
import { prisma } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { slug } = req.query;

    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Buscar posts relacionados
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: post.id },
        OR: [
          { categoryId: post.categoryId },
          {
            tags: {
              some: {
                id: {
                  in: post.tags.map(tag => tag.id),
                },
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    res.status(200).json({ 
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

