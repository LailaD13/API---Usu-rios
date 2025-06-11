import express, { request, response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())


app.post('/usuarios', async (request, response) => {
  console.log('Corpo recebido:', request.body);

  const { email, name, age } = request.body;

  // Verifica se os campos obrigatórios estão preenchidos
  if (!email || !name || age === undefined || age === null || age === '') {
    return response.status(400).json({ error: 'Preencha todos os campos: email, name e age (inteiro)' });
  }

  // Verifica se o age é um número válido
  const ageNumber = Number(age);
  if (isNaN(ageNumber) || !Number.isInteger(ageNumber)) {
    return response.status(400).json({ error: 'O campo age deve ser um número inteiro' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        age: ageNumber
      }
    });

    response.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return response.status(409).json({ error: 'Email já cadastrado' });
    }

    response.status(500).json({ error: 'Erro interno do servidor' });
  }
});


/* endereço (rota) do metodo HTTP*/

app.get('/usuarios', async (request, response) => {
    const nome = request.query.nome?.toString().toLowerCase();

  try {
    let usuarios;

    if (nome) {
        usuarios = await prisma.user.findMany({
        where: {
          name: {
            equals: nome,
            mode: 'insensitive'
          }
        }
      });
    } else {
      usuarios = await prisma.user.findMany();
    }

    response.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    response.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/usuarios/:id', async (request, response) => {
  await prisma.user.update({
    where: {
      id: request.params.id
    },
    data: {
      email: request.body.email,
      name: request.body.name,
      age: request.body.age
    }
  })
})

app.delete('/usuarios/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.user.delete({
      where: { id }
    });

    response.status(200).json({ message: "Usuário deletado!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    response.status(500).json({ error: "Erro ao deletar usuário", details: error });
  }
});


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})


/* Criar API de usuários */

/* Login: rodolfo
   senha: senha123
*/