fetch("https://pokeapi.co/api/v2/type/grass")
  .then((res) => res.json())
  .then(async (data) => {
    console.log("Pokémons tipo Grama:", data);
    const container = document.getElementById("pokemons");
    const listaPokemons = data.pokemon.slice(0, 12);

    listaPokemons.forEach(async (item) => {
      const res = await fetch(item.pokemon.url);
      const pokeData = await res.json();

      const card = document.createElement("div");
      card.classList.add("card");

      const tipos = pokeData.types
        .map((t) =>`<span class="tag ${t.type.name}">${t.type.name.toUpperCase()}</span>`)
        .join("");

      const habilidades = pokeData.abilities
        .map((a) => a.ability.name)
        .join(", ");

      const imagem = pokeData.sprites.other["official-artwork"].front_default;
      const ataque = pokeData.stats.find((s) => s.stat.name === "attack").base_stat;
      const defesa = pokeData.stats.find((s) => s.stat.name === "defense").base_stat;

      card.innerHTML = `
        <img src="${imagem}" alt="${pokeData.name}" class="poster">
        <h2>${pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}</h2>
        <div class="tipos">${tipos}</div>
        <p><strong>Altura:</strong> ${pokeData.height / 10}m
        <strong>ATK:</strong> ${ataque}</p>
        <p><strong>Peso:</strong> ${pokeData.weight / 10} Kg
        <strong>DEF:</strong> ${defesa}</p>
        <p class="habilities"><strong>Habilidades:</strong> ${habilidades}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch((err) => console.error("Erro ao carregar Pokémons:", err));