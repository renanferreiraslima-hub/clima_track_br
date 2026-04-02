```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Clima Inteligente</title>

  <!-- Fonte -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">

  <style>

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }

    body {
      background: linear-gradient(135deg, #312e81, #6366f1);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: auto;
    }

    .title {
      color: white;
      margin-bottom: 20px;
      font-size: 28px;
    }

    /* INPUT */
    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 25px;
    }

    .search-box input {
      flex: 1;
      padding: 12px;
      border-radius: 10px;
      border: none;
      outline: none;
    }

    .search-box button {
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      background: #4f46e5;
      color: white;
      cursor: pointer;
    }

    /* GRID */
    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    /* CARD */
    .card {
      background: rgba(255,255,255,0.9);
      border-radius: 20px;
      padding: 20px;
      transition: 0.3s;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .card-header span {
      font-size: 22px;
    }

    .card h3 {
      font-size: 18px;
    }

    .card p {
      font-size: 14px;
      color: #4b5563;
    }

    .card ul {
      list-style: none;
      margin-top: 10px;
    }

    .card ul li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .btn {
      margin-top: 10px;
      padding: 10px;
      border-radius: 10px;
      border: none;
      background: #4f46e5;
      color: white;
      cursor: pointer;
    }

    .section-title {
      color: white;
      margin: 25px 0 10px;
    }

    #checklist li {
      color: white;
      margin: 5px 0;
    }

  </style>
</head>

<body>

<div class="container">

  <h1 class="title">🌤️ Clima Inteligente</h1>

  <!-- BUSCA -->
  <div class="search-box">
    <input id="cityInput" placeholder="Digite a cidade...">
    <button onclick="searchCity()">Buscar</button>
  </div>

  <!-- CARDS -->
  <section id="suggestionsSection">

    <div class="suggestions-grid">

      <!-- COMIDA -->
      <div class="card">
        <div class="card-header">
          <span id="foodEmoji">🍲</span>
          <h3>Refeição</h3>
        </div>
        <p id="foodTitle"></p>
        <p id="foodDesc"></p>
        <button id="foodBtn" class="btn">Ver receita</button>
      </div>

      <!-- ROUPAS -->
      <div class="card">
        <div class="card-header">
          <span>👕</span>
          <h3>Roupas</h3>
        </div>
        <ul id="clothesList"></ul>
      </div>

      <!-- TREINO -->
      <div class="card">
        <div class="card-header">
          <span id="workoutEmoji">💪</span>
          <h3>Treino</h3>
        </div>
        <p id="workoutTitle"></p>
        <p id="workoutDesc"></p>
      </div>

      <!-- MÚSICA -->
      <div class="card">
        <div class="card-header">
          <span>🎵</span>
          <h3>Música</h3>
        </div>
        <p>Playlist baseada no clima (em breve)</p>
      </div>

      <!-- PETS -->
      <div class="card">
        <div class="card-header">
          <span>🐶</span>
          <h3>Pets</h3>
        </div>
        <ul id="petsList"></ul>
      </div>

      <!-- FAMÍLIA -->
      <div class="card">
        <div class="card-header">
          <span>👨‍👩‍👧</span>
          <h3>Família</h3>
        </div>
        <ul id="familyList"></ul>
      </div>

    </div>

    <h3 class="section-title">✅ Planejamento do Dia</h3>
    <ul id="checklist"></ul>

  </section>

</div>

<!-- IMPORTANTE: ORDEM DOS SCRIPTS -->
<script src="suggestions.js"></script>
<script src="api.js"></script>

</body>
</html>
```
