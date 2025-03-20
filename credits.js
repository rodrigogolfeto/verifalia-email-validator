const verifalia = require('verifalia');
require('dotenv').config();

async function verificarSaldoCreditos() {
  try {
    const client = new verifalia.VerifaliaRestClient({
        username: process.env.VERIFALIA_USERNAME,
        password: process.env.VERIFALIA_PASSWORD
    });
    
    const saldo = await client.credits.getBalance();
    return saldo;
  } catch (erro) {
    console.error('Erro ao verificar saldo:', erro);
    throw erro;
  }
}

async function verificarSaldoComFetch() {
  try {
    const credenciais = Buffer.from(`${process.env.VERIFALIA_USERNAME}:${process.env.VERIFALIA_PASSWORD}`).toString('base64');
    
    const resposta = await fetch('https://api.verifalia.com/v2.4/credits/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credenciais}`,
        'Accept': 'application/json'
      }
    });
    
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao verificar saldo:', erro);
    throw erro;
  }
}

async function exibirSaldo() {
  try {
    const saldo = await verificarSaldoCreditos();
    const freeCredits = saldo.freeCredits || 0;
    const paidCredits = saldo.paidCredits || 0;
    const totalCredits = freeCredits + paidCredits;
    
    console.log('Saldo de créditos:');
    console.log(`Créditos disponíveis: ${freeCredits}`);
    console.log(`Créditos pagos: ${paidCredits}`);
    console.log(`Total: ${totalCredits}`);
  } catch (erro) {
    console.error('Falha ao verificar saldo:', erro);
  }
}

exibirSaldo();
