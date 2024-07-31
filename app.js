const vm = new Vue({
      el: "#app",
      data:{
            produtos: [],
            produto: false,
            carrinho:[],
            carrinhoAtivo: false,
            mensagemAlerta: "Item adicionado",
            alertaAtivo:false
      },
      computed:{
            carrinhoTotal(){
                  let total = 0;
                  if(this.carrinho.length){
                        this.carrinho.forEach(item =>{
                              total += item.preco
                        })
                  }
                  return total;
            }
      },
      methods:{
            // fetch de produtos
            fetchProdutos(){
                  fetch('./api/produtos.json')
                  .then(r =>r.json())
                  .then(r =>{
                        this.produtos = r
                  })
            },
            fetchProdutoUnico(id){
                  fetch(`./api/produtos/${id}/dados.json`)
                  .then(r =>r.json())
                  .then(r =>{
                        this.produto = r
                  })
            },

            // Modal de produtos individuais
            fecharModal({target, currentTarget}){
                  if(target === currentTarget) this.produto=false
            },
            abrirModal(id){
                  this.fetchProdutoUnico(id);
                  window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                  })
            },

            // carrinho
            adicionarItem(){
                  this.produto.estoque--;
                  const {id, nome, preco} = this.produto
                  this.carrinho.push({id, nome, preco})
                  this.alerta(`${nome} foi adicionado ao carrinho`)
            },
            removerItem(index){
                  this.alerta(`${this.carrinho[index].nome} foi removido do carrinho`)
                  this.carrinho.splice(index, 1)
            },

            clickForaCarrinho({target, currentTarget}){
                  if(target === currentTarget) this.carrinhoAtivo=false
            },


            // Adicionais do sistema
            checarLocalSotrage(){
                  if(window.localStorage.carrinho){
                        this.carrinho = JSON.parse(window.localStorage.carrinho)
                  }
            },

            alerta(mensagem){
                  this.mensagemAlerta = mensagem;
                  this.alertaAtivo = true;
                  setTimeout(() => {
                        this.alertaAtivo = false
                  }, 1500);
            },

            router(){
                  const hash = document.location.hash;
            
                  if(hash){
                        this.fetchProdutoUnico(hash.replace("#", ""))
                  }
                  
            },

            //ESTOQUE
            compararEstoque(){
                  const itens = this.carrinho.filter(({id}) => id === this.produto.id);
                  this.produto.estoque -= itens.length
            }
      },
      filters:{
          numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
          }  
      },
      watch:{
            carrinho(){
                  window.localStorage.carrinho = JSON.stringify(this.carrinho)
            },
            produto(){
                 document.title = this.produto.nome || 'Techno'
                 const hash = this.produto.id|| '';
                 history.pushState(null, null, `#${hash}`) 
                 if(this.produto){
                       this.compararEstoque()
                 }
            }
      },
      created(){
            this.fetchProdutos()
            this.checarLocalSotrage()
      },
      mounted(){
            this.router()
      }
      
})