// pages/api/admin/posts/index.js
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, status, category } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = {};
      if (status) where.status = status;
      if (category) where.categoryId = category;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
            author: {
              select: { id: true, name: true, email: true }
            },
            category: {
              select: { id: true, name: true, slug: true }
            },
            tags: {
              select: { id: true, name: true, slug: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.post.count({ where }),
      ]);

      res.status(200).json({
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        status = 'DRAFT',
        categoryId,
        tagIds = [],
        publishedAt,
      } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
      }

      // Verificar se slug já existe
      if (slug) {
        const existingPost = await prisma.post.findUnique({
          where: { slug },
        });
        if (existingPost) {
          return res.status(400).json({ error: 'Slug já existe' });
        }
      }

      // Gerar slug se não fornecido
      const finalSlug = slug || title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      const post = await prisma.post.create({
        data: {
          title,
          slug: finalSlug,
          excerpt,
          content,
          featuredImage,
          status,
          authorId: req.user.id,
          categoryId: categoryId || null,
          publishedAt: status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
          tags: {
            connect: tagIds.map(id => ({ id })),
          },
        },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            select: { id: true, name: true, slug: true }
          }
        },
      });

      res.status(201).json({ message: 'Post criado com sucesso', post });
    } catch (error) {
      console.error('Erro ao criar post:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}

export default requireAdmin(handler);

