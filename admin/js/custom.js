$(document).ready(function() {
    
    function populateTable() {

    	$.ajax({
            url: "../api/orders.php",
            //method : "POST",
            dataType: 'json',
            type: "POST",
            data: { 
		        'action': 'fetch-all-orders'
		    },
            cache : false
        }).done(function(data) {
            
            console.log(data);

            //
		  	var template = Hogan.compile(
		  		'<table class="table">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>ID</th>'
				+       '<th>name</th>'
                +       '<th>phone</th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>'
	  			+ 		'{{#orders}}'
				+ 			'<tr>'
				+   			'<th scope="row">{{id}}</th>'
				+               '<td>{{name}}</td>'
                +               '<td>{{phone}}</td>'
                +            '</tr>'
	      		+        '{{/orders}}'
                +	'</tbody>'
				+ '</table>'
	  		);

	  		$('#table-container').html(template.render(data));
        });
    }

    populateTable();
});