const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const verifalia = require('verifalia');
require('dotenv').config();

// Inicialize o cliente Verifalia
const client = new verifalia.VerifaliaRestClient({
    username: process.env.VERIFALIA_USERNAME,
    password: process.env.VERIFALIA_PASSWORD
});

const arquivoCSV = 'test.csv';
const pastaResultados = `validacao_emails_${Date.now()}`;
fs.mkdirSync(pastaResultados, { recursive: true });

const arquivoValidos = path.join(pastaResultados, 'emails_validos.csv');
const arquivoInvalidos = path.join(pastaResultados, 'emails_invalidos.csv');
const arquivoResumo = path.join(pastaResultados, 'resumo_validacao.txt');

// Função para escrever cabeçalhos nos arquivos
fs.writeFileSync(arquivoValidos, 'email\n');
fs.writeFileSync(arquivoInvalidos, 'email\n');
fs.writeFileSync(arquivoResumo, 'Resumo da validação de e-mails:\n\n');

// Função para ler os e-mails do CSV
async function lerEmailsDoCSV(caminho) {
    return new Promise((resolve, reject) => {
        const emails = [];
        
        fs.createReadStream(caminho)
            .pipe(csvParser({ separator: ';' }))
            .on('data', (row) => {
                const email = row.email.replace(/"/g, '').trim();
                if (email) {
                    emails.push(email);
                }
            })
            .on('end', () => resolve(emails))
            .on('error', (err) => reject(err));
    });
}

// Função para verificar um lote de e-mails
async function verificarLoteEmails(emails) {
    try {
        console.log('Submetendo e-mails para verificação...');
        const submissao = await client.emailValidations.submit(emails, {
            quality: 'high',
            priority: 'normal',
            retention: '1d'
        });

        console.log(`Submissão criada com ID: ${submissao.overview.id}`);
        
        async function verificarStatus(id) {
            return await client.emailValidations.get(id);
        }
        
        console.log('Verificando e-mails, aguarde...');
        let resultado = submissao;
        let tentativas = 0;
        const maxTentativas = 30;
        
        while (resultado.overview.status !== 'Completed' && tentativas < maxTentativas) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            resultado = await verificarStatus(submissao.overview.id);
            tentativas++;
            console.log(`Tentativa ${tentativas}: Status atual: ${resultado.overview.status}, Progresso: ${resultado.overview.progress || 0}%`);
        }
        
        if (tentativas >= maxTentativas && resultado.overview.status !== 'Completed') {
            throw new Error('Tempo limite excedido para a verificação dos e-mails');
        }
        
        return resultado;
    } catch (erro) {
        console.error('Erro ao verificar lote de e-mails:', erro);
        throw erro;
    }
}

// Função principal
async function processarEmails() {
    try {
        const emails = await lerEmailsDoCSV(arquivoCSV);
        console.log(`Total de e-mails lidos: ${emails.length}`);
        
        const resultado = await verificarLoteEmails(emails);
        
        console.log(`\nVerificação concluída. Status geral: ${resultado.overview.status}`);
        
        if (resultado.entries && resultado.entries.length > 0) {
            let validos = 0;
            let invalidos = 0;
            
            resultado.entries.forEach(entrada => {
                const email = entrada.inputData;
                if (entrada.classification === 'Deliverable') {
                    fs.appendFileSync(arquivoValidos, `${email}\n`);
                    validos++;
                } else {
                    fs.appendFileSync(arquivoInvalidos, `${email}\n`);
                    invalidos++;
                }
            });
            
            const resumo = `Total de e-mails processados: ${resultado.entries.length}\n` +
                `E-mails válidos: ${validos}\n` +
                `E-mails inválidos ou arriscados: ${invalidos}\n`;
            
            fs.appendFileSync(arquivoResumo, resumo);
            console.log(resumo);
        }
    } catch (erro) {
        console.error('Erro ao processar e-mails:', erro);
    }
}

// Executar a verificação
processarEmails();
