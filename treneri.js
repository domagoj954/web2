var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 10;
//--------forma za unos trenera

function insertFormTreneri(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ID</th><td><input hidden id="ID"></td></tr>';
    output += '<tr><th scope="col">IME</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '<tr><th scope="col">IDlige</th><td><input type="text" id="IDlige"></td></tr>';
    output += '<tr><th scope="col">GODINE</th><td><input type="text" id="GODINE"></td></tr>';
    output += '<tr><th scope="col">NACIONALNOST</th><td><input type="text" id="NACIONALNOST"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiTrener">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showTreneri(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showTreneri(page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormTreneri(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">IME</th><th scope="col">PREZIME</th><th scope="col">IDklub</th>';
    tablica += '<th scope="col">IDlige</th><th scope="GODINE">GODINE</th><th scope="col">NACIONALNOST</th>';
    tablica += '<th scope="col">ACTION</th></tr>';

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_treneri", 
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
                    tablica += '<td>' + v.IDlige + '</td>';
                    tablica += '<td>' + v.GODINE + '</td>';
                    tablica += '<td>' + v.NACIONALNOST + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showTrener(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delTrener(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
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
function showTrener(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_treneri", "ID": ID},
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input hidden id="ID" value="' + v.ID + '"></td></tr>';
                    tablica += '<tr><th scope="col">IME</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub" value="' + v.IDklub + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDlige</th><td><input type="text" id="IDlige" value="' + v.IDlige + '"></td></tr>';
                    tablica += '<tr><th scope="col">GODINE</th><td><input type="text" id="GODINE" value="' + v.GODINE + '"></td></tr>';
                    tablica += '<tr><th scope="col">NACIONALNOST</th><td><input type="text" id="NACIONALNOST" value="' + v.NACIONALNOST + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiTrener">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showTreneri(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
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

//-----------------------SAVE TRENER---------------------------
$(document).on('click', '#spremiTrener', function () {
    var ID = $('#ID').val();
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var IDklub = $('#IDklub').val();
    var IDlige = $('#IDlige').val();
    var GODINE = $('#GODINE').val();
    var NACIONALNOST = $('#NACIONALNOST').val();

    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime ternera');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite prezime trenera');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite IDklub trenera');
    } else if (IDlige == null || IDlige == "") {
        Swal.fire('Molimo unesite IDlige ternera');
    } else if (GODINE == null || GODINE == "") {
        Swal.fire('Molimo unesite godine trenera');
    } else if (NACIONALNOST == null || NACIONALNOST == "") {
        Swal.fire('Molimo unesite nacionalnost trenera');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_treneri",
                "ID": ID,
                "IME": IME,
                "PREZIME": PREZIME,
                "IDklub": IDklub,
                "IDlige": IDlige,
                "GODINE": GODINE,
                "NACIONALNOST": NACIONALNOST,
                "ACTION": "edit"
    
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli trenera');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showTreneri();
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

//-------------------Brisanje trenera---------------
function delTrener(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati trenera?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši trenera!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_save_treneri",
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
                            'ste obrisali trenera',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showTreneri();
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

