import * as fs from 'fs'
import * as pdf from 'pdf-parse'

const dataBuffer = fs.readFileSync('pdf/resumido.pdf')

pdf(dataBuffer).then(function (data) {
  // Expressão regular para identificar títulos de disciplinas e seções
  const reDisciplina = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/
  const reSecao =
    /PRÁTICAS DE LINGUAGEM|CAMPOS DE ATUAÇÃO|OBJETOS DE CONHECIMENTO|HABILIDADES PE/g

  let linhas = data.text.split('\n')
  let disciplinas = []
  let secoes = []
  let disciplinaAtual = ''

  linhas.forEach((linha) => {
    if (reDisciplina.test(linha)) {
      disciplinaAtual = linha
      disciplinas.push({ disciplina: disciplinaAtual, secoes: [] })
    } else if (reSecao.test(linha)) {
      secoes.push(linha)
      let index = disciplinas.findIndex((d) => d.disciplina === disciplinaAtual)
      if (index !== -1) {
        disciplinas[index].secoes = [...disciplinas[index].secoes, ...secoes]
        secoes = []
      }
    }
  })

  console.log(disciplinas)
})
