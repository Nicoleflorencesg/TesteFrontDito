$(document).ready(function () {

  $.ajax({
    type: "GET",
    url: "https://storage.googleapis.com/dito-questions/events.json",
    success: function (data) {
      resposta = data.events

      var container = {};

      var produto = {};

      for (i in resposta) {
        var transId = resposta[i].custom_data.filter(obj => { return obj.key === "transaction_id" })[0].value;

        if (container[transId] == undefined) {
          container[transId] = {}
          container[transId].preco = []
        }

        if (container[transId].timestamp == undefined) {
          container[transId].timestamp = resposta[i].timestamp;
        } else {
          if (new Date(container[transId].timestamp) < resposta[i].timestamp) {
            container[transId].timestamp = resposta[i].timestamp;
          }
        }


        if (resposta[i].revenue != undefined) {
          container[transId].preco.push(resposta[i].revenue);
        }

        if (produto[transId] == undefined) {
          produto[transId] = {}
          produto[transId].nome = []
          produto[transId].preco = []
          produto[transId].loja = []
        }

        if (resposta[i].custom_data.filter(obj => { return obj.key === "product_name" }).length > 0) {
          produto[transId].nome.push(resposta[i].custom_data.filter(obj => { return obj.key === "product_name" })[0].value)
        }

        if (resposta[i].custom_data.filter(obj => { return obj.key === "product_price" }).length > 0) {
          produto[transId].preco.push(resposta[i].custom_data.filter(obj => { return obj.key === "product_price" })[0].value)
        }

        if (resposta[i].custom_data.filter(obj => { return obj.key === "store_name" }).length > 0) {
          produto[transId].loja.push(resposta[i].custom_data.filter(obj => { return obj.key === "store_name" })[0].value)
        }

      }
      for (p in produto) {
        for (c in container) {
          if (p == c) {
            if (container[c].produto == undefined) {
              container[c].produto = []
              container[c].produto.push(produto[p]);
            } else {
              container[c].produto.push(produto[p]);
            }
          }
        }
      }


      var containers = [];
      for (c in container) {
        containers.push(container[c]);
      }
      containers.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      for (c in containers) {

        var date = new Date(containers[c].timestamp)
        var dateString = `${containers[c].timestamp.split('T')[0].split('-')[2]}/${containers[c].timestamp.split('T')[0].split('-')[1]}/${containers[c].timestamp.split('T')[0].split('-')[0]}`

        hora = `${date.getHours()}:${date.getMinutes()}`

        $(".timeline").append(

          `
            <div class="container right">
              <div class="content">
                <div>
                  <div class="info">
                    <div id="date_${c}"><img src="icons/calendar.svg" alt="" width="12px"/> ${dateString}</div>
                    <div id="hora_${c}"><img src="icons/clock.svg" alt="" width="12px"/> ${hora}</div>
                    <div id="local_${c}"><img src="icons/place.svg" alt="" width="12px"/></div> 
                    <div id="preco_${c}"><img src="icons/money.svg" alt="" width="12px"/></div>
                  </div>
                  
                  <div class="product_price">
                    <span>Produto</span>
                    <span>Preço</span>
                  </div>
                  <div class="value">
                  
                    <div id=produto_nome_${c} style = " display:flex; flex-direction: column; justify-content: space-between;">
                      
                    </div>

                    <div id=produto_preco_${c} style = " display:flex; flex-direction: column">
                    
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
        )
        if (containers[c].produto[0].loja.length > 0) {
          $(`#local_${c}`).append(
            `
            ${containers[c].produto[0].loja[0]}

            `
          );
        } else {
          $(`#local_${c}`).css("display", "none");
        }
        if (containers[c].preco != undefined) {
          $(`#preco_${c}`).append(
            `
            R$${containers[c].preco},00

            `
          );
        } else {
          $(`#preco_${c}`).css("display", "none");
        }

        for (n in containers[c].produto[0].nome) {
          $(`#produto_nome_${c}`).append(
            `<span>
                ${containers[c].produto[0].nome[n]}
            </span>`

          )
        }

        for (p in containers[c].produto[0].preco) {
          $(`#produto_preco_${c}`).append(
            `<span>
                R$${containers[c].produto[0].preco[p]}
            </span>`

          )
        }


      }

    }
  });
});