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
              console.log(error);
            });
        }
      });
  
  
    } catch {
        
    }
  }