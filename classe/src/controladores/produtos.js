const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        let condicao = '';
        const params = [];

        if (categoria) {
            condicao += 'and categoria ilike ?';
            params.push(`%${categoria}%`);
        }

        const query = `select * from produtos where usuario_id = ? ${condicao}`;
        const { rows: produtos } = await knex.raw(`${query}`, [usuario.id, ...params]);

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const query = `select * from produtos where usuario_id = ? and id = ?`;
        const { rows, rowCount } = await knex.raw(query, [usuario.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;
    let categoriaNull = categoria;
    let imagemNull = imagem;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    if (!categoriaNull) {
        categoriaNull = null;
    }

    if (!imagemNull) {
        imagemNull = null;
    }

    try {
        const query = 'insert into produtos (usuario_id, nome, estoque, preco, categoria, descricao, imagem) values (?, ?, ?, ?, ?, ?, ?)';
        const produto = await knex.raw(query, [usuario.id, nome, estoque, preco, categoriaNull, descricao, imagemNull]);

        if (produto.rowCount === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const query = `select * from produtos where usuario_id = ? and id = ?`;
        const { rowCount } = await knex.raw(query, [usuario.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const body = {};
        const params = [];
        let n = 1;

        if (nome) {
            body.nome = nome;
            params.push(`nome = ?`);
            n++;
        }

        if (estoque) {
            body.estoque = estoque;
            params.push(`estoque = ?`);
            n++;
        }

        if (categoria) {
            body.categoria = categoria;
            params.push(`categoria = ?`);
            n++;
        }

        if (descricao) {
            body.descricao = descricao;
            params.push(`descricao = ?`);
            n++;
        }

        if (preco) {
            body.preco = preco;
            params.push(`preco = ?`);
            n++;
        }

        if (imagem) {
            body.imagem = imagem;
            params.push(`imagem = ?`);
            n++;
        }

        const valores = Object.values(body);
        valores.push(id);
        valores.push(usuario.id);
        const queryAtualizacao = `update produtos set ${params.join(', ')} where id = ? and usuario_id = ?`;
        const produtoAtualizado = await knex.raw(queryAtualizacao, valores);

        if (produtoAtualizado.rowCount === 0) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const query = `select * from produtos where usuario_id = ? and id = ?`;
        const { rowCount } = await knex.raw(query, [usuario.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex.raw('delete from produtos where id = ?', [id]);

        if (produtoExcluido.rowCount === 0) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}