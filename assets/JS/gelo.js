fetch("https://pokeapi.co/api/v2/type/ice")
  //busca uma requisição HTTP para coletar os dados dessa API que passamos o link, que retorna uma Promise
  .then((res) => res.json())
  //depois do fetch, ele vai coletar os dados como uma resposta, e transformará ela em json, e também retornará outra Promise
  .then(async (data) => {
    //depois de converter, ele passa para uma função assíncrona como dados
    console.log("Pokémons tipo Gelo:", data);
    //mostra no console tudo o que veio dos dados coletados da API
    const container = document.getElementById("pokemons");

    const listaPokemons = data.pokemon.slice(0, 12);
    /*primeiro, ele cria uma constante de lista de pokémons, como se fosse um array
      o array realmente, é o data.pokemon com todos os pokémons do tipo que a gente chamou
      o método slice(0, 12) vai "cortar" o array para 12 pedaços, nesse caso, vai pegar os 12 primeiros pokemons

      O .slice nada mais é um método que pega um trecho do array de um índice até o outro, nesse caso, de 0 a 12. Se colocarmos somente o primeiro índice, ele pega daquele em diante, ou seja, do índice indicado até o infinito e além
    */

    listaPokemons.forEach(async (item) => {
      //o forEach vai executar o mesmo comando dentro de cada item do array de pokémons que a gente criou antes, e é preciso declarar ele como async para usar o await dentro dele, que irá fazer o código "em partes" e não tudo de uma vez, evitando quebrar ele"

      const res = await fetch(item.pokemon.url);
      //ele faz uma requisição dos dados completos do pokémon, não só o nome, mas sim tudo de todos os pokémons daquele tipo que selecionamos no começo, esperando com o await, que só existe a partir do momento que usamos async no forEach. teoricamente, o que está escrito seria "vamos coletar (fetch) cada item (forEach(async(item)) da API do pokémon (pokemon.url) e retornaremos uma resposta (res) somente quando requerirmos tudo de dentro dela (await)"
      const pokeData = await res.json();
      //ele vai ler toda a resposta que o comando anterior teve e converter para JSON para usarmos ao longo do código, e temos que esperar isso acontecer para rodar todo o resto do programa, por isso usamos await
      const card = document.createElement("div");
      //ele cria uma div no DOM, mas não está visível até que o appendChild seja feito
      card.classList.add("card");
      //vai colocar uma class "card" na div para editar no CSS
      const tipos = pokeData.types
        .map((t) =>`<span class="tag ${t.type.name}">${t.type.name.toUpperCase()}</span>`)
        .join("");
      //aqui ele cria uma constante tipos, que vai coletar da pokeData que fizemos antes, aquela coleta depois do fetch que transformamos em JSON, está na linha 22. o .map vai transformar cada item do array em algo, nesse caso em string. e dentro da função, para cada t (variável qualquer), ele vai adicionar/pegar o nome do tipo (t.type.name) dentro da class e dentro da string. Dentro da class é para editar no CSS, e na string é para exibir o nome no HTML, que inclusive estará em toUpperCase. Depois de pegar todos os tipos de um determinado pokémon, ele vai juntar as strings que ele gerou, ou seja, todos os tipos que ele encontrou, em uma coisa só, que é o caso da constante tipos, que vai conter todos os tipos daquele pokémon.

      const habilidades = pokeData.abilities
        .map((a) => a.ability.name)
        .join(", ");
      //aqui é a mesma lógica do tipos, mas ao invés de converter para string, ele já pega o nome direto de cada um com o map, e junta tudo com o join (que já transforma em string), com cada item separado por vírgula

      const imagem = pokeData.sprites.other["official-artwork"].front_default;
      //a constante imagem vai pegar a imagem do pokémon determinado com o "sprites". ao colocar .other["official-artwork"].front_default é o URL da imagem do pokémon em alta qualidade, então ao invés dela sair toda borrada, ela sai em um PNG ou SVG bonito

      const ataque = pokeData.stats.find((s) => s.stat.name === "attack").base_stat;
      const defesa = pokeData.stats.find((s) => s.stat.name === "defense").base_stat;
      //tanto o ataque quanto a defesa funciona da mesma forma. primeiro o pokeData.stats é um array com os dados de ataque, defesa e outras coisas (inúteis por enquanto), o .find vai ser o método que vai encontrar o primeiro elemento do array que satisfaça a condição que colocamos, no caso, o nome dele (s.stat.name) que for igual a "attack" ou "defense" vai ser onde vamos coletar os dados que precisamos, e o .base_stat vai coletar o valor numérico de cada um para retornar no card.

      // Card final
      card.innerHTML = `
        <img src="${imagem}" alt="${pokeData.name}" class="poster">
        <h2>${
          pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)
        }</h2>
        <div class="tipos">${tipos}</div>
        <p><strong>Altura:</strong> ${pokeData.height / 10}m
        <strong>ATK:</strong> ${ataque}</p>
        <p><strong>Peso:</strong> ${pokeData.weight / 10} Kg
        <strong>DEF:</strong> ${defesa}</p>
        <p class="habilities"><strong>Habilidades:</strong> ${habilidades}</p>
      `;
      //o ${pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)} vai deixar a primeira letra em maiúsculo, com o array 0, e depois concatena com o resto do nome, com o slice, que vai "completar" com o resto do nome (a partir do array 1, ou seja, da segunda letra em diante) e exibir o nome completo. O height e weight precisa dividir por 10 pois a unidade de medida está em dm, e para ir em m precisa dividir.

      container.appendChild(card);
      //o appendChild vai inserir um card atrás do outro no DOM, ou seja, insere os filhos no pai (ficou estranho mas é isso mesmo)
    });
  })
  .catch((err) => console.error("Erro ao carregar Pokémons:", err));
//aqui ele captura qualquer erro que ocorrer em todo esse código, e caso der erro, ele exibe uma mensagem de erro com o .catch