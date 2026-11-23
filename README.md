# Site HIGIVARO

Site estático em 5 páginas, com estilo e script compartilhados.

- `index.html`: início (slides, números, marcas, categorias, resumo das páginas).
- `catalogo.html`: catálogo completo (busca, filtro por categoria; aceita `?cat=` e `?q=` na URL).
- `empresas.html`: empresas e órgãos públicos.
- `entrega.html`: entrega e como comprar.
- `sobre.html`: quem somos.
- `style.css` e `app.js`: visual e comportamento de todas as páginas.
- `produtos.json`: lista de produtos (código, nome, marca, embalagem, categoria, tem foto), sem preços.
- `img/logo.png` e `img/p/<codigo>.jpg`: logo e fotos dos produtos.
- `sitemap.xml` e `robots.txt`: apontam para https://higivarooficial.github.io/
- `index-v1.html`: versão antiga (backup); pode ser apagada.

Os arquivos são gerados à mão; todos os links são relativos, então funcionam em subpasta (GitHub Pages). Para publicar, envie o conteúdo desta pasta para o repositório. Para atualizar o catálogo, regenere `produtos.json` e copie as fotos novas para `img/p/`.
