observador();
var estado = false;
var urlProfile = "https://images.vexels.com/media/users/3/147103/isolated/lists/e9bf9a44d83e00b1535324b0fda6e91a-icono-de-linea-de-perfil-de-instagram.png";
const db = firebase.firestore();
const actUsuario = (id, usuarioActualizado) => db.collection('usuarios').doc(id).update(usuarioActualizado);
function registrar() {
  console.log("diste un click");
  var email = document.getElementById('correo').value;
  var contraseña = document.getElementById('contraseña').value;
  var confirmarContraseña = document.getElementById('confirmarContra').value;
  if (contraseña != confirmarContraseña) {
    aviso = document.getElementById("sugerencias");
    aviso.innerHTML = `<div>
      <p id="segerencia">las contraseñas no coinciden</p>
      </div>`;
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, contraseña)
      .then((user) => {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
      <p id="aviso">registrado exitosamente</p>
      </div>`;
        editarPerfil1();

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage)
        if (errorCode == "auth/email-already-in-use") {
          aviso = document.getElementById("sugerencias");
          aviso.innerHTML = `<div>
          <p id="sugerencia">el correo ya está en uso</p>
          </div>`;
        }
        if (errorCode == "auth/weak-password") {
          aviso = document.getElementById("sugerencias");
          aviso.innerHTML = `<div>
          <p id="sugerencia">la contraseña es demasiado débil</p>
          </div>`;
        } if (errorCode == "auth/invalid-email") {
          aviso = document.getElementById("sugerencias");
          aviso.innerHTML = `<div>
          <p id="sugerencia">el correo no es válido</p>
          </div>`;
        }
      });
  }

function editarPerfil1(){
  window.location.href="editarPerfil.html";
  aviso = document.getElementById("aviso");
          aviso.innerHTML = `<div>
          <p id="sugerencia">debe editar su perfil.</p>
          </div>`;
}
}
function ingreso() {
  var email = document.getElementById('correo2').value;
  var password = document.getElementById('contraseña2').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("ingresó")
      window.location.href = "main.html#una";
      console.log("cambió de pag");

    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/wrong-password") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
      <p id="sugerencia">la contraseña es incorrecta</p>
      </div>`;
      } if (errorCode == "auth/invalid-email") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
      <p id="sugerencia">el correo es incorrecto</p>
      </div>`;
      } if (errorCode == "auth/user-not-found") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
      <p id="sugerencia">usted no tiene una cuenta</p>
      </div>`;
      }
      console.log(errorCode, errorMessage);
    });
}
var datosU = [];
var docId;
var IdInsti;

function observador() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      uid = user.uid;

      db.collection("usuarios").where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var datos = doc.data();
            datosU[0] = datos.nombre;
            datosU[1] = datos.apellido;
            datosU[2] = datos.institucion;

            if (datosU.length == 3) {
              estado = true;

              nombre = document.getElementById('nombre');
              apellido = document.getElementById('apellido');
              institucion = document.getElementById('institucion');
              perfil = document.getElementById('image')

              nombre.value = datosU[0];
              apellido.value = datosU[1];
              institucion.value = datosU[2];

              perfil.src = datos.urlProfile;
              urlProfile = datos.urlProfile;
              docId = doc.id;
            }
          });
        })
        .catch((error) => {

        });
      try {
        const contenedor2 = document.getElementById("tabTree");
        contenedor2.innerHTML =
          `<hr><br><br>
     <img width="12%" title="Editar Perfil" onclick="editarPerfil()" src="img/usuario.png">
      <h5>Perfil</h5>
      <br><br><hr><br>
      <img width="12%" title="Agregar Reporte" onclick="agregarReporte()" src="img/addReport.png">
      <h5>Agregar Reporte</h5>
      <br><br><hr><br>
      <img width="12%" title="Agregar Publicación" onclick="agregarPublicacion()" src="img/add.png">
      <h5>Agregar Publicación</h5>
      <br><br><hr><br>
      <img width="10%" title="Cerrar sesión" onclick="cerrarS()" src="img/logout.png">
      <h5>Cerrar sesión</h5>
      `;
      } catch {

      }






    } else {
      try {
        const contenedor = document.getElementById("tabOne");
        contenedor.innerHTML = `<div>
        <h3>Usted no ha iniciado sesión</h3>
        <a href="index.html" class="btn btn-danger">Inicia sesión</a>
        </div>`;
        const contenedor3 = document.getElementById("tabTwo");
        contenedor3.innerHTML = `<div>
        <h3>Usted no ha iniciado sesión</h3>
        <a href="index.html" class="btn btn-danger">Inicia sesión</a>
        </div>`;
        const contenedor4 = document.getElementById("tabTree");
        contenedor4.innerHTML = `<div>
        <h3>Usted no ha iniciado sesión</h3>
        <a href="index.html" class="btn btn-danger">Inicia sesión</a>
        </div>`;
      } catch {
        console.log("ventana incorecta");
      }



    }
  });
}
observador();

function feeder() {
  var nombres = [];
  var descripciones = [];
  var ubicaciones = [];
  var idinstitucion;
  try {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        uid = user.uid;

        db.collection("usuarios").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var datos = doc.data();

              idinstitucion = datos.institucion;

              tab1 = document.getElementById('tab1');
              db.collection("publicaciones").where("InsId", "==", idinstitucion)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    tab1.innerHTML = "";
                  });
                })
                .catch((error) => {

                });
              db.collection("publicaciones").where("InsId", "==", idinstitucion)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    var datos2 = doc.data();

                    tab1.innerHTML += `<hr><br><h2>${datos2.nombreO}</h2>
                    <h4>${datos2.descripcionO}</h4>
                    <h5>${datos2.ubicaObjeto}</h5>
                    <img width="30%" src="${datos2.urlProfile}">`;
                  });
                })
                .catch((error) => {

                });

            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
      }
    });


  } catch {

  }
}

function feeder2() {
  var nombres = [];
  var descripciones = [];
  var ubicaciones = [];
  var idinstitucion;
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        uid = user.uid;

        db.collection("usuarios").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var datos = doc.data();

              idinstitucion = datos.institucion;

              tab2 = document.getElementById('tab2');
              db.collection("reportes").where("InsId", "==", idinstitucion)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    var datos2 = doc.data();

                    tab2.innerHTML = "";
                  });
                })
                .catch((error) => {

                });
              db.collection("reportes").where("InsId", "==", idinstitucion)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    var datos2 = doc.data();

                    tab2.innerHTML += `<hr><br><h2>${datos2.nombreO}</h2>
                    <h4>${datos2.descripcionO}</h4>
                    <h5>${datos2.ubicaObjeto}</h5>
                    `;
                  });
                })
                .catch((error) => {

                });

            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
      }
    });


  } catch {

  }
}
function feederUser() {

  var idinstitucion;
  try {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        uid = user.uid;
        var tab2 = document.getElementById('tabOneUser');
        db.collection("publicaciones").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              tab2.innerHTML="";
            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
          db.collection("publicaciones").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var datos2 = doc.data();
              tab2.innerHTML+=`<center><hr><br><h2>${datos2.nombreO}</h2>
              <h4>${datos2.descripcionO}</h4>
              <h5>${datos2.ubicaObjeto}</h5>
              <img width="30%" src="${datos2.urlProfile}"></center>`;
              

            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
      }
    });


  } catch {

  }
}
function feeder2User() {

  
  try {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        uid = user.uid;
        var tab2 = document.getElementById('tabTwoUser');
        db.collection("reportes").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              tab2.innerHTML="";
            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
          db.collection("reportes").where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var datos2 = doc.data();
              tab2.innerHTML+=`<center><hr><br><h2>${datos2.nombreO}</h2>
              <h4>${datos2.descripcionO}</h4>
              <h5>${datos2.ubicaObjeto}</h5>
              </center>`;;
              

            });
          })
          .catch((error) => {
            console.log("id's inexistentes");
          });
      }
    });


  } catch {

  }
}
feeder();
feeder2();
feederUser();
feeder2User();
function agregarPublicacion() {
  window.location.href = "publicar.html";

}
function back() {
  window.location.href = "main.html#tres";
}
function main1() {
  window.location.href = "main.html#uno";
}
function inicioSesion() {
  window.location.href = "index.html";
}
function editarPerfil() {
  window.location.href = "editarPerfil.html";

}
function agregarReporte() {
  window.location.href = "reporte.html";
}
function cerrarS() {
  console.log("holis");
  firebase.auth().signOut()
    .then(function () {
      console.log("salió");
      window.location.href = "index.html";
    })
    .catch(function (error) {
      console.log("no salió");
    })
}

function listener() {
  observador();
  try {
    if (!estado) {
      event.preventDefault();
      nombre = document.getElementById('nombre').value;
      apellido = document.getElementById('apellido').value;
      institucion = document.getElementById('institucion').value;
      if (nombre != "" && apellido != "" && institucion != "") {
        db.collection('usuarios').doc().set({
          uid,
          nombre,
          apellido,
          institucion,
          urlProfile
        })
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
       <p id="aviso">perfil actualizado exitosamente</p>
       </div>`;
      } else {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
          <p id="sugerencia">los campos no pueden estar vacíos</p>
          </div>`;
      }
    }


    else {
      observador();
      event.preventDefault();
      nombre3 = document.getElementById('nombre').value;
      apellido3 = document.getElementById('apellido').value;
      institucion3 = document.getElementById('institucion').value;
      imageElement = document.getElementById('image');
      if (nombre3 != "" && apellido3 != "" && institucion3 != "") {
        actUsuario(docId, {
          nombre: nombre3,
          apellido: apellido3,
          institucion: institucion3,
          urlProfile: urlProfile
        })
        nombre.value = datosU[0];
        apellido.value = datosU[1];
        institucion.value = datosU[2];
        idIns = datosU[2];
        imageElement.url = urlProfile;
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="aviso">perfil actualizado exitosamente</p>
        </div>`;
      } else {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
          <p id="sugerencia">los campos no pueden estar vacíos</p>
          </div>`;
      }

    }
  } catch {
    aviso = document.getElementById("captura");
    aviso.innerHTML = `<div>
    <h3>Usted no ha iniciado sesión</h3>
    <a href="index.html" class="btn btn-danger">Inicia sesión</a>
    </div>`;
  }



}
function onUpload(e) {
  console.log("subir", e);
}
function uploadImage() {
  try {

    const ref = firebase.storage().ref();
    const file = document.getElementById('photo').files[0];
    var hoy = new Date();
    hora = hoy.getHours() + ':' + hoy.getSeconds() + ':' + hoy.getMinutes();
    horaFecha = hoy.getDate() + ':' + (hoy.getMonth() + 1) + ':' + hoy.getFullYear() + ':' + hora;
    const name = file.name + ':' + horaFecha;
    if (file == null) {
      aviso = document.getElementById("sugerencias");
      aviso.innerHTML = `<div>
      <p id="sugerencia">debe seleccionar una imagen</p>
  </div>`;
    } else {
      const metadata = {
        contentType: file.type
      }
      const task = ref.child(name).put(file, metadata);
      aviso = document.getElementById("sugerencias");
          aviso.innerHTML = `<div>
            <img width="30%" src="img/carga.gif">
            </div>`;
      task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

          aviso = document.getElementById("sugerencias");
          aviso.innerHTML = `<div>
            <p id="aviso">imagen subida corectamente</p>
            </div>`;
          var imageElement = document.getElementById('image');
          urlProfile = url;
          imageElement.src = url;
        });

    }
  } catch {
    aviso = document.getElementById("sugerencias");
    aviso.innerHTML = `<div>
      <p id="sugerencia">debe seleccionar una imagen</p>
      </div>`;
  }

}


function HacerPublicacion() {
  event.preventDefault();

  observador();
  if (estado) {
    
    nombreO = document.getElementById('nombreObjeto').value;
    descripcionO = document.getElementById('descriObejto').value;
    ubicaObjeto = document.getElementById('ubiObjeto').value;

    var InsId = datosU[2];
    if (nombreO != "" && descripcionO != "" && ubicaObjeto != "") {
      db.collection('publicaciones').doc().set({
        nombreO,
        descripcionO,
        ubicaObjeto,
        uid,
        InsId,
        urlProfile
      })
      aviso = document.getElementById("sugerencias");
      aviso.innerHTML = `<div>
        <p id="aviso">publicado correctamente</p>
        </div>`;
    } else {
      aviso = document.getElementById("sugerencias");
      aviso.innerHTML = `<div>
        <p id="sugerencia">ningún campo puede estar vacío</p>
        </div>`;
    }



  } else {
    aviso = document.getElementById("sugerencias");
    aviso.innerHTML = `<div>
        <p id="sugerencia">usted no ha actualizado su perfil</p>
        </div>`;
  }
  nombreO = document.getElementById('nombreObjeto');
  descripcionO = document.getElementById('descriObejto');
  ubicaObjeto = document.getElementById('ubiObjeto');
  nombreO.value = "";
  descripcionO.value = "";
  ubicaObjeto.value = "";

}
function HacerReporte() {
  event.preventDefault();

  observador();
  if (estado) {

    nombreO = document.getElementById('nombreObjeto').value;
    descripcionO = document.getElementById('descriObejto').value;
    ubicaObjeto = document.getElementById('ubiObjeto').value;
    if (nombreO != "" && descripcionO != "" && ubicaObjeto != "") {
      var InsId = datosU[2];
      db.collection('reportes').doc().set({
        nombreO,
        descripcionO,
        ubicaObjeto,
        uid,
        InsId,
      })
      aviso = document.getElementById("sugerencias");
      aviso.innerHTML = `<div>
        <p id="aviso">reportado correctamente</p>
        </div>`;
    } else {
      aviso = document.getElementById("sugerencias");
      aviso.innerHTML = `<div>
      <p id="sugerencia">ningún campo puede estar vacío</p>
      </div>`;
    }
  } else {
    aviso = document.getElementById("sugerencias");
    aviso.innerHTML = `<div>
        <p id="sugerencia">usted no ha actualizado su perfil</p>
        </div>`;
  }
  nombreO = document.getElementById('nombreObjeto');
  descripcionO = document.getElementById('descriObejto');
  ubicaObjeto = document.getElementById('ubiObjeto');
  nombreO.value = "";
  descripcionO.value = "";
  ubicaObjeto.value = "";

}
function editable() {
  contenido3 = document.getElementById("contenido3");
  contenido3.innerHTML = `<form>
      <div class="form-gruop">
          <img width="70%" id="image" width="300">
          <br><hr>
      </div>
      <div class="form-group">
          <h5>Nombre*</h5>
          <input type="text" 
          id="nombre" 
          class="form-control"
          placeholder="Nombre"
          autofocus>
      </div>
      <div class="form-group">
          <h5>Apellido*</h5>
          <input id="apellido" 
          class="form-control" 
          placeholder="apellido">
      </div>
      <div class="form-group">
          <h5>Institución*</h5>
          <select class="form-control" id="institucion">
              <option value="udeaCode">universidad de antioquia</option>
              <option value="udemCode">universidad de medellin</option>
              <option value="uclaCode">universidad católica Luis Amigó</option>
              <option value="eiaCode">escuela de ingenieros de antioquia</option> 
              <option value="iueCode">institución universitaria esumer</option>
          </select>
      </div>
      <div class="form-group">
          
          <h5>foto de perfil</h5>
          <input  type="file" 
          name="fichero" 
          value="" 
          id="photo" 
          class="form-control"
          accept="image/png, image/jpeg, image/gif">
          
          
      </div>
      <div class="form-group">
          <input type="button" 
          class="btn btn-secondary"
          onclick="uploadImage()" 
          value="subir imagen">
      </div>
      <hr>
      <div id="sugerencias" class="form-gruop">
      </div>
      <div id="captura">
      <button onclick="listener()" class="btn btn-danger" id="btn-task-form">
          guardar
      </button>
      </div>
    </form>`
  observador();
}