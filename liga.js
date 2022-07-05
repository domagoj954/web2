var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 10;


//--------forma za unos liga
function insertFormLige(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ID</th><td><input hidden id="ID"></td></tr>';
    output += '<tr><th scope="col">KLUB_LIGE</th><td><input type="text" id="KLUB_LIGE"></td></tr>';
    output += '<tr><th scope="col">OSTALE_LIGE</th><td><input type="text" id="OSTALE_LIGE"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '<tr><th scope="col">DRZAVA</th><td><input type="text" id="DRZAVA"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiLiga">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showLige(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showLige(page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormLige(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">KLUB_LIGE</th><th scope="col">OSTALE_LIGE</th><th scope="col">IDklub</th>'
    tablica += '<th scope="col">DRZAVA</th>'
    tablica += '<th scope="col">ACTION</th></tr>';

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_liga", 
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
                    tablica += '<tr><td>' + v.KLUB_LIGE + '</td>';
                    tablica += '<td>' + v.OSTALE_LIGE + '</td>';
                    tablica += '<td>' + v.IDklub + '</td>';
                    tablica += '<td>' + v.DRZAVA + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showLiga(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delLiga(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
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
function showLiga(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_liga", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">KLUB_LIGE</th><td><input type="text" id="KLUB_LIGE" value="' + v.KLUB_LIGE + '"></td></tr>';
                    tablica += '<tr><th scope="col">OSTALE_LIGE</th><td><input type="text" id="OSTALE_LIGE" value="' + v.OSTALE_LIGE + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub" value="' + v.IDklub + '"></td></tr>';
                    tablica += '<tr><th scope="col">DRZAVA</th><td><input type="text" id="IDklub" value="' + v.DRZAVA + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiLiga">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showLige(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
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

//-----------------------SAVE LIGA---------------------------
$(document).on('click', '#spremiLiga', function () {
    var KLUB_LIGE = $('#KLUB_LIGE').val();
    var OSTALE_LIGE = $('#OSTALE_LIGE').val();
    var IDklub = $('#IDklub').val();
    var DRZAVA = $('#DRZAVA').val();
    var ID = $('#ID').val();

    if (KLUB_LIGE == null || KLUB_LIGE  == "") {
        Swal.fire('Molimo unesite nacionalnu ligu');
    } else if (OSTALE_LIGE == null || OSTALE_LIGE == "") {
        Swal.fire('Molimo unesite ostale lige');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite IDklub lige');
    } else if (DRZAVA == null || DRZAVA == "") {
        Swal.fire('Molimo unesite drzavu nacionalne lige');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_liga",
                "ID": ID,
                "KLUB_LIGE": KLUB_LIGE,
                "OSTALE_LIGE": OSTALE_LIGE,
                "IDklub": IDklub,
                "DRZAVA": DRZAVA,
                "ACTION": "edit"
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli ligu');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showLige();
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

//-------------------Brisanje lige---------------
function delLiga(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati ligu?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši ligu!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_delete_liga",
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
                            'ste obrisali ligu',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showLige();
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

