var base_url =
  "https://wrapper.rasitech.id/api-football/v4/";
var optionsdate = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
var loading = `<center>
<div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-red">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-yellow">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-green">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</center>`;

//dateformat
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

const fetchAPI = url => {
  return fetch(url) // Tidak perlu kirim API Key dari browser
    .then(res => {
      if (res.status !== 200) {
        console.log("Error: " + res.status);
        return Promise.reject(new Error(res.statusText));
      } else {
        return res.json();
      }
    })
    .catch(err => {
      console.error(err);
    });
};

// Blok kode untuk melakukan request data json
function getArticles() {
  document.getElementById("body-content").innerHTML = loading;

  if ("caches" in window) {
    caches
      .match(base_url + "competitions/2021/teams")
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            showArticle(data);
          });
        }
      });
  }

  fetchAPI(base_url + "competitions/2021/teams")
    .then((data) => {
      showArticle(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getArticleById() {
  document.getElementById("body-content").innerHTML = loading;

  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            var kompetisi = `<ul class="collection">`;
            data.activeCompetitions.forEach(function (listkomp) {
              kompetisi += `
                  <li class="collection-item">${listkomp.name} (${listkomp.area.name})</li>
              `;
            });
            kompetisi += "</ul>";

            var squad = `<table class="responsive-table">
                  <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>WN</th>
                    </tr>
                  </thead>
                  <tbody>`;
            data.squad.forEach(function (listsquad) {
              squad += `
                  <tr>
                      <td>${listsquad.name}</td>
                      <td>${listsquad.position}</td>
                      <td>${listsquad.nationality}</td>
                    </tr>
              `;
            });
            squad += "</tbody></table>";

            var datatimHTML = `
                <div class="card">
                  <div class="card-content">
                    <img src="${data.crest}" width="30%" />
                    <h3>${data.name}</h3>
                    <blockquote>
                      <p>Stadion : ${data.venue}</p>
                      <p>Alamat : ${data.address}</p>
                      <p>Telp : ${data.phone}</p>
                      <p>Website : ${data.website}</p>
                      <p>Email : ${data.email}</p>
                      <p>Berdiri Tahun : ${data.founded}</p>
                      <p>Warna Tim : ${data.clubColors}</p>
                    </blockquote>
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">airplay</i>Kompetisi</div>
                        <div class="collapsible-body">${kompetisi}</div>
                      </li>
                      <li>
                        <div class="collapsible-header"><i class="material-icons">assignment_ind</i>Squad</div>
                        <div class="collapsible-body">${squad}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = datatimHTML;

            var collapsibles = document.querySelectorAll(".collapsible");
            for (var i = 0; i < collapsibles.length; i++) {
              M.Collapsible.init(collapsibles[i]);
            }
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    var myHeaders = new Headers();
    // myHeaders.append("X-Auth-Token", "70cafa8df7f942c689db882dde9863d1");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(base_url + "teams/" + idParam, requestOptions)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // Menyusun komponen card artikel secara dinamis
        let kompetisi = `<ul class="collection">`;
        if (Array.isArray(data.runningCompetitions)) {
          data.runningCompetitions.forEach(function (listkomp) {
            kompetisi += `
      <li class="collection-item">${listkomp.name} (${listkomp.area?.name || '-'})</li>`
          })
        } else {
          kompetisi += `<li class="collection-item">Tidak ada kompetisi aktif</li>`
        };

        kompetisi += `</ul>`;

        var squad = `<table class="responsive-table">
              <thead>
                <tr>
                    <th>Nama</th>
                    <th>Posisi</th>
                    <th>WN</th>
                </tr>
              </thead>
              <tbody>`;
        data.squad.forEach(function (listsquad) {
          squad += `
              <tr>
                  <td>${listsquad.name}</td>
                  <td>${listsquad.position}</td>
                  <td>${listsquad.nationality}</td>
                </tr>
          `;
        });
        squad += "</tbody></table>";

        var datatimHTML = `
            <div class="card">
              <div class="card-content">
                <img src="${data.crest}" width="30%" />
                <h3>${data.name}</h3>
                <blockquote>
                  <p>Stadion : ${data.venue}</p>
                  <p>Alamat : ${data.address}</p>
                  <p>Telp : ${data.phone}</p>
                  <p>Website : ${data.website}</p>
                  <p>Email : ${data.email}</p>
                  <p>Berdiri Tahun : ${data.founded}</p>
                  <p>Warna Tim : ${data.clubColors}</p>
                </blockquote>
                <ul class="collapsible">
                  <li>
                    <div class="collapsible-header"><i class="material-icons">airplay</i>Kompetisi</div>
                    <div class="collapsible-body">${kompetisi}</div>
                  </li>
                  <li>
                    <div class="collapsible-header"><i class="material-icons">assignment_ind</i>Squad</div>
                    <div class="collapsible-body">${squad}</div>
                  </li>
                </ul>
              </div>
            </div>
          `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = datatimHTML;

        var collapsibles = document.querySelectorAll(".collapsible");
        for (var i = 0; i < collapsibles.length; i++) {
          M.Collapsible.init(collapsibles[i]);
        }
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  document.getElementById("body-content").innerHTML = loading;

  getAll().then(function (datatim) {
    // Menyusun komponen card artikel secara dinamis
    if (datatim.length > 0) {
      var datatimHTML = `<h3 class="light">Tim Favorit</h3><hr><div class="row"><div class="col s12 m12">`;
      datatim.forEach(function (datatim) {
        datatimHTML += `
      <div class="col s12 m3">
        <div class="card">
          <div class="card-image">
            <img src="${datatim.crest}" alt="${datatim.name}">
            <a class="btn-floating halfway-fab waves-effect waves-light red" href="./article.html?id=${datatim.id}&saved=true"><i class="material-icons">remove_red_eye</i></a>
          </div>
          <div class="card-content">
          <span class="title">${datatim.name}</span>
          <p>${datatim.venue}<br>
          </div>
        </div>
      </div>`;
      });
      datatimHTML += `</div>`;
    } else {
      var datatimHTML = `<div class="col s12 m4 l2"><p class="z-depth-5 shadow-demo card-panel center" style="font-family: 'Fredoka One', cursive;
      font-size: 40px;">Daftar Tim Favorit</p></div>
      <div class="divider"></div>
      <div class="row"><div class="col s12 m12">Anda Belum Memilih Tim Favorit</div></div>`;
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = datatimHTML;
  });
}

function getSavedArticleById() {
  document.getElementById("body-content").innerHTML = loading;

  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  getById(idParam).then(function (data) {
    let kompetisi = `<ul class="collection">`;
    if (Array.isArray(data.runningCompetitions)) {
      data.runningCompetitions.forEach(function (listkomp) {
        kompetisi += `
      <li class="collection-item">${listkomp.name} (${listkomp.area?.name || '-'})</li>`
      })
    } else {
      kompetisi += `<li class="collection-item">Tidak ada kompetisi aktif</li>`
    };

    kompetisi += `</ul>`;

    var squad = `<table class="responsive-table">
          <thead>
            <tr>
                <th>Nama</th>
                <th>Posisi</th>
                <th>WN</th>
            </tr>
          </thead>
          <tbody>`;
    data.squad.forEach(function (listsquad) {
      squad += `
          <tr>
              <td>${listsquad.name}</td>
              <td>${listsquad.position}</td>
              <td>${listsquad.nationality}</td>
            </tr>
      `;
    });
    squad += "</tbody></table>";

    var datatimHTML = `
        <div class="card">
          <div class="card-content">
            <img src="${data.crest}" width="30%" />
            <h3>${data.name}</h3>
            <blockquote>
              <p>Stadion : ${data.venue}</p>
              <p>Alamat : ${data.address}</p>
              <p>Telp : ${data.phone}</p>
              <p>Website : ${data.website}</p>
              <p>Email : ${data.email}</p>
              <p>Berdiri Tahun : ${data.founded}</p>
              <p>Warna Tim : ${data.clubColors}</p>
            </blockquote>
            <ul class="collapsible">
              <li>
                <div class="collapsible-header"><i class="material-icons">airplay</i>Kompetisi</div>
                <div class="collapsible-body">${kompetisi}</div>
              </li>
              <li>
                <div class="collapsible-header"><i class="material-icons">assignment_ind</i>Squad</div>
                <div class="collapsible-body">${squad}</div>
              </li>
            </ul>
          </div>
        </div>              
      `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = datatimHTML;
  });
}

function getKompetisi() {
  var Day = new Date();
  var firstDay = formatDate(new Date());
  var nextWeek = formatDate(new Date(Day.getTime() + 7 * 24 * 60 * 60 * 1000));

  // Declare datatimHTML here so it's accessible to both blocks
  var datatimHTML = `<table class="striped"><thead><tr><th>Upcoming Matches</th></tr></thead><tbody>`;

  if ("caches" in window) {
    caches
      .match(
        base_url +
        "competitions/2021/matches?dateFrom=" +
        firstDay +
        "&dateTo=" +
        nextWeek
      )
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            // Reset datatimHTML for cached data
            datatimHTML = `<table class="striped"><thead><tr><th>${data.competition.name}</th></tr></thead><tbody>`;
            data.matches.forEach(function (datatim) {
              var d = new Date(datatim.utcDate);
              datatimHTML += `
                      <tr><td>
                      <strong>${d.toLocaleDateString(
                "en-US",
                optionsdate
              )}</strong><br>
                      ${datatim.homeTeam.name} VS ${datatim.awayTeam.name}
                      </td></tr>
                    `;
            });
            datatimHTML += `</tbody></table>`;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("jadwalmain").innerHTML = datatimHTML;
          });
        }
      });
  }

  var myHeaders = new Headers();
  // myHeaders.append("X-Auth-Token", "70cafa8df7f942c689db882dde9863d1");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch(
    base_url +
    "competitions/2021/matches?dateFrom=" +
    firstDay +
    "&dateTo=" +
    nextWeek,
    requestOptions
  )
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Reset datatimHTML for fetched data (in case cache was empty or outdated)
      datatimHTML = `<table class="striped"><thead><tr><th>${data.competition.name}</th></tr></thead><tbody>`;
      data.matches.forEach(function (datatim) {
        var d = new Date(datatim.utcDate);
        datatimHTML += `
                  <tr><td>
                  <strong>${d.toLocaleDateString("en-US", optionsdate)}</strong><br>
                  ${datatim.homeTeam.name} VS ${datatim.awayTeam.name}
                  </td></tr>
                `;
      });
      datatimHTML += `</tbody></table>`;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("jadwalmain").innerHTML = datatimHTML;
    })
    .catch(error);
}

// INI UNTUK RENDER DATA DARI FETCH API
function showArticle(data) {
  var articlesHTML = "";
  data.teams.forEach(function (article) {
    articlesHTML += `
        <div class="col s12 m6">
          <div class="card sticky-action">
            <div class="card-image waves-effect waves-block waves-light logo-team activator">
              <img src="${article.crest}" class="activator" width="30" alt="${article.name}">
            </div>

            <div class="divider"></div>

            <div class="card-content">
            <h6>${article.name}</h6>
            </div>

            <div class="divider"></div>

            <div class="card-action">
              <a href="./article.html?id=${article.id}" class="waves-effect waves-light btn">
                Detail Tim
              </a>
              <a class="waves-effect waves-light btn activator">
                Ringkasan Profile
              </a>
            </div>

            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">${article.name}<i class="material-icons right">close</i></span>
              <p>${article.address}</p>
              <p>${article.email}</p>
              <p>${article.phone}</p>
              <p>${article.venue}</p>
              <p href="${article.website}">${article.website}</p>
            </div>

          </div>
        </div>
            `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("articles").innerHTML = articlesHTML;
}
