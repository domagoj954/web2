var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 10;

//--------forma za unos fanova


function insertFormFanovi(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ID</th><td><input hidden id="ID"></td></tr>';
    output += '<tr><th scope="col">IME</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">EMAIL</th><td><input type="EMAIL" id="EMAIL"></td></tr>';
    output += '<tr><th scope="col">JMBAG</th><td><input type="text" id="JMBAG"></td></tr>';
    output += '<tr><th scope="col">OVLASTI</th><td><input type="text" id="OVLASTI"></td></tr>';
    output += '<tr><th scope="col">SPOL</th><td><input type="text" id="SPOL"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '<tr><th scope="col">LOZINKA</th><td><input type="text" id="LOZINKA"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiFan">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showFanovi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showFanovi(page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormFanovi(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">IME</th><th scope="col">PREZIME</th><th scope="col">JMBAG</th>';
    tablica += '<th scope="col">EMAIL</th><th scope="col">SPOL</th>'
    tablica += '<th scope="col">OVLASTI</th><th scope="col">IDklub</th><th scope="col">ACTION</th></tr>';

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_fanovi", 
               "perPage": perPage,  //mora biti definirano
               "page": page 
            },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><td>' + v.IME + '</td>';
                    tablica += '<td>' + v.PREZIME + '</td>';
                    tablica += '<td>' + v.JMBAG + '</td>';
                    tablica += '<td>' + v.EMAIL + '</td>';
                    tablica += '<td>' + v.SPOL + '</td>';
                    tablica += '<td>' + v.OVLASTI + '</td>';
                    tablica += '<td>' + v.IDklub + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showFan(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delFanovi(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(page, perPage, count);
                $("#container").html(tablica);
            } else {
                if (errcode == 999) {
                    $("#container").html(loginForm);
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            }
            refresh();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}
//-----------------------------------------------------------------------------
function showFan(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_fanovi", "ID": ID},
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">IME</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">EMAIL</th><td><input type="text" id="EMAIL" value="' + v.EMAIL + '"></td></tr>';
                    tablica += '<tr><th scope="col">JMBAG</th><td><input type="text" id="JMBAG" value="' + v.JMBAG + '"></td></tr>';
                    tablica += '<tr><th scope="col">SPOL</th><td><input type="text" id="SPOL" value="' + v.SPOL + '"></td></tr>';
                    tablica += '<tr><th scope="col">OVLASTI</th><td><input type="text" id="OVLASTI" value="' + v.OVLASTI + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub" value="' + v.IDklub + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiFan">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showFanovi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                $("#container").html(tablica);
            } else {
                if (errcode == 999) {
                    $("#container").html(loginForm);
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            }
            refresh();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}

//-----------------------SAVE KORISNIK---------------------------
$(document).on('click', '#spremiFan', function () {
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var JMBAG = $('#JMBAG').val();
    var EMAIL = $('#EMAIL').val();
    var SPOL = $('#SPOL').val();
    var OVLASTI = $('#OVLASTI').val();
    var IDklub = $('#IDklub').val();
    var ID = $('#ID').val();

     if (IME == null || IME == "") {
        Swal.fire('Molimo unesite IME fana');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite PREZIME fana');
    } else if (JMBAG == null || JMBAG == "") {
        Swal.fire('Molimo unesite JMBAG fana');
    } else if (EMAIL == null || EMAIL == "") {
        Swal.fire('Molimo unesite EMAIL fana');
    } else if (SPOL == null || SPOL == "") {
        Swal.fire('Molimo unesite SPOL fana');
    } else if (OVLASTI == null || OVLASTI == "") {
        Swal.fire('Molimo unesite OVLASTI fana');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite ID kluba fana');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_fanovi",
                "ID": ID,
                "IME": IME,
                "PREZIME": PREZIME,
                "JMBAG": JMBAG,
                "EMAIL": EMAIL,
                "SPOL": SPOL,
                "OVLASTI": OVLASTI,
                "IDklub":IDklub,
                "ACTION": "edit"
            },
            success: function (data) {
                console.log("Tu sam" + data);
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;


                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli fana');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showFanovi();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})

//-------------------Brisanje fana---------------
function delFanovi(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati fana?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši fana!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_delete_fanovi",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali fana',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showFanovi();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}

