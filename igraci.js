var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 15;


//--------forma za unos igraca


function insertFormIgraci(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">IME</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '<tr><th scope="col">NACIONALNOST</th><td><input type="text" id="NACIONALNOST"></td></tr>';
    output += '<tr><th scope="col">GODINE</th><td><input type="text" id="GODINE"></td></tr>';
    output += '<tr><th scope="col">POZICIJA</th><td><input type="text" id="POZICIJA"></td></tr>';
    output += '<tr><th scope="col">BROJ</th><td><input type="text" id="BROJ"></td></tr>';
    output += '<tr><th scope="col">BROJ_GOLOVA</th><td><input type="text" id="BROJ_GOLOVA"></td></tr>';
    output += '<tr><th scope="col">ODIGRANIH_UTAKMICA</th><td><input type="text" id="ODIGRANIH_UTAKMICA"></td></tr>';
    output += '<tr><th scope="col">VRIJEDNOST(€)</th><td><input type="text" id="VRIJEDNOST"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiIgraca">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showIgraci(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showIgraci(page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormIgraci(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">IME</th><th scope="col">PREZIME</th><th scope="col">IDklub</th>';
    tablica += '<th scope="col">NACIONALNOST</th><th scope="col">GODINE</th>'
    tablica += '<th scope="col">POZICIJA</th><th scope="col">BROJ</th>'
    tablica += '<th scope="col">BROJ_GOLOVA</th><th scope="col">ODIGRANIH_UTAKMICA</th>'
    tablica += '<th scope="col">VRIJEDNOST(€)</th><th scope="col">ACTION</th></tr>'

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_igraci", 
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
                    tablica += '<td>' + v.NACIONALNOST + '</td>';
                    tablica += '<td>' + v.GODINE + '</td>';
                    tablica += '<td>' + v.POZICIJA + '</td>';
                    tablica += '<td>' + v.BROJ + '</td>';
                    tablica += '<td>' + v.BROJ_GOLOVA + '</td>';
                    tablica += '<td>' + v.ODIGRANIH_UTAKMICA + '</td>';
                    tablica += '<td>' + v.VRIJEDNOST + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showIgrac(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delIgrac(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
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
function showIgrac(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_igraci", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">IME</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">PREZIME</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="EMAIL" value="' + v.IDklub + '"></td></tr>';
                    tablica += '<tr><th scope="col">NACIONALNOST</th><td><input type="text" id="OIB" value="' + v.NACIONALNOST + '"></td></tr>';
                    tablica += '<tr><th scope="col">GODINE</th><td><input type="text" id="GODINE" value="' + v.GODINE + '"></td></tr>';
                    tablica += '<tr><th scope="col">POZICIJA</th><td><input type="text" id="POZICIJA" value="' + v.POZICIJA + '"></td></tr>';
                    tablica += '<tr><th scope="col">BROJ</th><td><input type="text" id="BROJ" value="' + v.BROJ + '"></td></tr>';
                    tablica += '<tr><th scope="col">BROJ_GOLOVA</th><td><input type="text" id="BROJ_GOLOVA" value="' + v.BROJ_GOLOVA + '"></td></tr>';
                    tablica += '<tr><th scope="col">ODIGRANIH_UTAKMICA</th><td><input type="text" id="ODIGRANIH_UTAKMICA" value="' + v.ODIGRANIH_UTAKMICA + '"></td></tr>';
                    tablica += '<tr><th scope="col">VRIJEDNOST(€)</th><td><input type="text" id="VRIJEDNOST" value="' + v.VRIJEDNOST + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiIgraca">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showIgraci(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
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

//-----------------------SAVE IGRAC---------------------------
$(document).on('click', '#spremiIgraca', function () {
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var IDklub = $('#IDklub').val();
    var NACIONALNOST = $('#NACIONALNOST').val();
    var GODINE = $('#GODINE').val();
    var POZICIJA = $('#POZICIJE').val();
    var BROJ = $('#BROJ').val();
    var BROJ_GOLOVA = $('#BROJ_GOLOVA').val();
    var ODIGRANIH_UTAKMICA = $('#ODIGRANIH_UTAKMICA').val();
    var VRIJEDNOST = $('#VRIJEDNOST').val();


    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime igraca');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite prezime igraca');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite IDklub igraca');
    } else if (NACIONALNOST == null || NACIONALNOST == "") {
        Swal.fire('Molimo unesite nacionalnost igraca');
    } else if (GODINE == null || GODINE == "") {
        Swal.fire('Molimo unesite godine igraca');
    } else if (POZICIJA == null || POZICIJA == "") {
        Swal.fire('Molimo unesite poziciju igraca');
    } else if ((BROJ == null || BROJ == "")){
        Swal.fire('Molimo unesite broj igraca');
    } else if ((BROJ_GOLOVA == null || BROJ_GOLOVA == "")){
        Swal.fire('Molimo unesite broj golova igraca');
    } else if ((ODIGRANIH_UTAKMICA == null || ODIGRANIH_UTAKMICA == "")){
        Swal.fire('Molimo unesite broj odigranih utakmica igraca');
    } else if ((VRIJEDNOST == null || VRIJEDNOST == "")){
        Swal.fire('Molimo unesite vrijednost igraca');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_igraci",
                "IME": IME,
                "PREZIME": PREZIME,
                "IDklub": IDklub,
                "NACIONALNOST": NACIONALNOST,
                "GODINE": GODINE,
                "POZICIJA": POZICIJA,
                "BROJ": BROJ,
                "BROJ_GOLOVA": BROJ_GOLOVA,
                "ODIGRANIH_UTAKMICA": ODIGRANIH_UTAKMICA,
                "VRIJEDNOST": VRIJEDNOST,
                "ACTION":"edit",
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli igraca');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showKlijenti();
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

//-------------------Brisanje igraca---------------
function delIgrac(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati igraca?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši igraca!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_save_igraci",
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
                            'ste obrisali igraca',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showIgraci();
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

