/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})
//// Busca todos os posts ///////
app.get('/Allposts', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { conteudo: req.body.conteudo},
        include: {usuario: true},
    })
    res.json(posts)
})
//// Busca posts por id /////
app.get('post/:id', async (req, res) => {
    const {id} = req.params
    const post = await prisma.post.findUnique({
        where: {id: Number(id)},
    })
    res.json(post)
})
///// Cria novo usuario /////
app.post(`/user`, async (req, res) => {
    const result = await prisma.user.create({
      data: { ...req.body },
    })
    res.json(result)
  })
//// Cria um novo post  
app.post(`/post`, async (req, res) => {
    const { conteudo } = req.body
    const result = await prisma.post.create({
      data: {
        conteudo,
        usuario: { connect: conteudo},
      },
    })
    res.json(result)
  })

//// Atualiza o campo de conteudo //// 
app.put('/post/publicado/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { conteudo: req.body.conteudo },
    })
    res.json(post)
  })

//// Deleta os posts por id /////
app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    })
    res.json(post)
  })

async function main() {
  const newUser = await prisma.user.create({
    data: {
      nome: 'Gustavo',
      email: 'Gusta@prisma.io',
      birthday: '22/02/2002',
      biografia: '',
      posts: {
        create: {
          conteudo: 'Primeira Postagem',
        },
      },
    },
  })
  const newUser2 = await prisma.user.create({
    data: {
      nome: 'Roberto',
      email: 'Roberto@prisma.io',
      birthday: '05/06/1985',
      biografia: 'Sao Paulo 011',
      posts: {
        create: {
          conteudo: 'Primeiro Post',
        },
      },
    },
  })
  console.log('Created new user: ', newUser, newUser2)
  const allUsers = await prisma.user.findMany({
    include: {posts: true},
  })
  console.log('All users: ')
  console.dir(allUsers, {depth: null})
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())

app.listen(3000,() => 
    console.log('Serving on port')
)