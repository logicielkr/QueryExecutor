function evalcode() {
	if(
		$("form#insert input.query_id").val() == ""
	) {
		autoSave(true, function() {evalcode2();});
	} else {
		evalcode2();
	}
}
function evalcode2() {
	$("form#insert textarea.results").val("");
	$("table.results").remove();
	var formData = null;
	formData = new FormData();

	formData.append("contents", $("form#insert textarea.contents").val());
	var url = "execute.xml";
	
	$.ajax({
		url: url,
		processData: false,
		contentType: false,
		type: 'POST',
		enctype: 'multipart/form-data',
		data: formData,
		success: function(result) {
			var obj = parse_xml_document(result);
			if(obj.results.err) {
				$("form#insert textarea.results").val("Error : " + obj.results.err);
			} else if(obj.results.error_code) {
				$("form#insert textarea.results").val("Error : " + obj.results.error_message + "(" + obj.results.error_code + "," + obj.results.sql_state + ")");
			} else if(obj.results.update_count) {
				$("form#insert textarea.results").val("Update Count : " + obj.results.update_count);
			} else if(obj.results.record_count) {
				if(obj.results.column_count) {
					$("form#insert textarea.results").val("Fetch Data : " + obj.results.column_count + " x " + obj.results.record_count);
					$("table#query").after("<table class='results'></table>");
					$("table.results").append("<tr class='header'></tr>");
					for(var i = 1; i <= obj.results.column_count; i++) {
						$("table.results tr.header").append("<th class='c_" + i + "'></th>");
						$("table.results tr.header th.c_" + i + "").append(document.createTextNode(obj.results["column_name_" + i]));
					}
					for(var x = 1; x <= obj.results.record_count; x++) {
						$("table.results").append("<tr class='data" + x + "'></tr>");
						for(var i = 1; i <= obj.results.column_count; i++) {
							$("table.results tr.data" + x + "").append("<td class='c_" + i + "'></td>");
							$("table.results tr.data" + x + " td.c_" + i + "").append(document.createTextNode(obj.results["column_data_" + x + "_" + i]));
						}
					}
				} else {
					$("form#insert textarea.results").val("Fetch Data : " + 0 + " x " + obj.results.record_count);
				}
			}
		}
	}).always(function() {
		
	});
}
function ctrlenter(e) {
	if((e.keyCode == 13 || e.keyCode == 10) && e.ctrlKey) {
		evalcode();
	}
}
function saveAsNew() {
	check_submit(
		document.getElementById("insert"), 
		'변경사항을 저장하시겠습니까?',
		function() {
			if($("form#insert input[name='parent_id']").val() == "") {
				$("form#insert input[name='parent_id']").val($("form#insert input[name='query_id']").val());
			}
			$("form#insert input[name='query_id']").val("");
		}
	);
}
$(document).ready(function() {
	if($("form#insert input[name='query_id']").val() != "") {
//		$("<button type='button' onclick='saveAsNew()'>새이름으로</button>").insertAfter($("button#insert_submit"));
		$("div.nav.top div.box.center").append($("<button type='button' onclick='saveAsNew()'>새이름으로</button>"));
	}
	$("textarea\.contents").keypress(function(e) {
			ctrlenter(e);
	});
	$("input\.execute").click(function() {
		evalcode();
	});
});
