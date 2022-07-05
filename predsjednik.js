//--------forma za unos predsjednika
var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 10;

function insertFormPredsjednici(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">IME</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiPredsjednik">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showPredsjednici(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showPredsjednici(page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormPredsjednici(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">IME</th><th scope="col">PREZIME</th><th scope="col">IDklub</th>';
    tablica += '<th scope="col">ACTION</th></tr>';

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_predsjednik", 
               "perPage": perPage, 
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
                    tablica += '<td>' + v.IDklub + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showPredsjednik(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delPredsjednik(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
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
function showPredsjednik(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_predsjednik", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">IME</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub" value="' + v.IDklub + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiPredsjednik">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showPredsjednici(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
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

//-----------------------SAVE PREDSJEDNIK---------------------------
$(document).on('click', '#spremiPredsjednik', function () {
    var ID = $('#ID').val();
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var IDklub = $('#IDklub').val();

    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime predsjednika');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite prezime predsjednika');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite IDklub predsjednika');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_predsjednik",
                "IME": IME,
                "PREZIME": PREZIME,
                "IDklub": IDklub,
                "ID": ID,
                "ACTION": "edit"
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log("Tu sam" + data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli predsjednika');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showPredsjednici();
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

//-------------------Brisanje predsjednika---------------
function delPredsjednik(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati predsjednika?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši predsjednika!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_save_predsjednik",
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
                            'ste obrisali predsjednika',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showPredsjednici();
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

