import * as fs from 'fs'
import * as pdfjsLib from 'pdfjs-dist'

;(async function () {
  async function extractDataFromPDF(filePath: string) {
    const dataBuffer = fs.readFileSync(filePath)
    const uint8Array = new Uint8Array(dataBuffer)
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdf = await loadingTask.promise

    const disciplinasConhecidas = [
      'Língua Portuguesa',
      'Educação Física',
      'Língua Inglesa',
      'Arte',
      'Matemática',
      'Ciências',
      'Geografia',
      'História',
      'Ensino Religioso',
    ]
    let disciplinas: { disciplina: string; secoes: string[] }[] = []
    let disciplinaAtual = ''
    const reSecao =
      /PRÁTICAS DE LINGUAGEM|CAMPOS DE ATUAÇÃO|OBJETOS DE CONHECIMENTO|HABILIDADES PE/g

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const textItems = textContent.items.map((item) => item.str)

      textItems.forEach((linha) => {
        if (disciplinasConhecidas.includes(linha)) {
          disciplinaAtual = linha
          disciplinas.push({ disciplina: disciplinaAtual, secoes: [] })
        } else if (reSecao.test(linha) && disciplinaAtual) {
          let index = disciplinas.findIndex(
            (d) => d.disciplina === disciplinaAtual,
          )
          if (index !== -1) {
            disciplinas[index].secoes.push(linha)
          }
        }
      })
    }

    return disciplinas
  }

  try {
    const disciplinas = await extractDataFromPDF('pdf/resumido.pdf')
    console.log(disciplinas)
  } catch (error) {
    console.error('Erro ao extrair dados do PDF:', error)
  }
})()
