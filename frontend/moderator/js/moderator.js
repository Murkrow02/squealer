// default settings for DataTables
Object.assign(DataTable.defaults, {
    "lengthChange": false,
    pageLength: 50,
});

function addSearchToColumns( columnDefs = []){

    let tableId = "#table";

    // Enable column-wise filtering
    $(`${tableId} thead tr`).clone(true).appendTo(`${tableId} thead`);
    $(`${tableId} thead tr:eq(1) th`).each(function (i) {
        const title = $(this).text();

        // If column is not searchable, don't add a search field
        if(columnDefs[i].searchable === false){
            $(this).html('');
            return;
        }

        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
    });
}

function renderTable(columnDefs = []){

    return $('#table').DataTable( {
        "sPaginationType": "full_numbers",
        columns: columnDefs,
        dom: 'Bfrtip',        // Needs button container
        select: 'single',
        fixedHeader: true,
        searching: false,
        responsive: true,
        altEditor: true,     // Enable altEditor
        buttons: [
            {
                text: 'Add',
                name: 'add'        // do not change name
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Edit',
                name: 'edit'        // do not change name
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Delete',
                name: 'delete'      // do not change name
            }
        ],
        onDeleteRow: function(datatable, rowdata, success, error) {
            console.log(rowdata);
            success();
        },
        onAddRow: function(datatable, rowdata, success, error) {
            console.log(rowdata);
            success();
        },
    });
}

function formatDate(datetimeString)
{
    const date = new Date(datetimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return  date.toLocaleDateString(undefined, options);
}