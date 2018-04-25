$(function(){
    // $('#restaurantTbl').Tabledit({
    //     url: 'example.php',
    //     columns: {
    //         identifier: [0, 'Name'],
    //         editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
    //     }
    // });

    $('#restaurantTbl').dataTable({
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ],
        responsive: true
    });

});