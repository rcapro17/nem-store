// pages/api/admin/posts/[id].js
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
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

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      res.status(200).json({ post });
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        status,
        categoryId,
        tagIds = [],
        publishedAt,
      } = req.body;

      // Verificar se post existe
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      // Verificar se slug já existe (exceto no post atual)
      if (slug && slug !== existingPost.slug) {
        const slugExists = await prisma.post.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return res.status(400).json({ error: 'Slug já existe' });
        }
      }

      // Preparar dados para atualização
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (content !== undefined) updateData.content = content;
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (status !== undefined) {
        updateData.status = status;
        if (status === 'PUBLISHED' && !existingPost.publishedAt) {
          updateData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
        }
      }
      if (categoryId !== undefined) updateData.categoryId = categoryId || null;

      // Atualizar tags se fornecidas
      if (tagIds.length >= 0) {
        updateData.tags = {
          set: tagIds.map(id => ({ id })),
        };
      }

      const post = await prisma.post.update({
        where: { id },
        data: updateData,
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

      res.status(200).json({ message: 'Post atualizado com sucesso', post });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      await prisma.post.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Post excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}

export default requireAdmin(handler);

