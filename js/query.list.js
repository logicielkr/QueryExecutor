$(document).ready(function() {
	var ext = location.pathname.substring(location.pathname.lastIndexOf(".") + 1);
	$.ajax({
		url: "autosaved.xml",
		processData: false,
		contentType: false,
		type: 'GET',
		success: function(result){
			var obj = parse_graha_xml_document(result);
			if(obj && obj.rows && obj.rows["query_history"] && obj.rows["query_history"].length > 0 && obj.rows["query_history"][0].query_history_id) {
				MessageArea.confirm(
					"자동저장된 게시물을 확인하시겠습니까?", 
					function() {
						location.href = "insert." + ext + "?query_history_id=" + obj.rows["query_history"][0].query_history_id;
					},
					function() {
						if(isEncrypted) {
							PwdArea.show(initDecrypt);
						}
					}
				);
			}
		}
	});
	if(isEncrypted) {
		PwdArea.show(function() {
			$("table#query td.encrypted_title").each(function() {
				if($(this).text() != "") {
					var encrypted = $(this).text();
					var target = $(this).parent().find("td.title a");
					target.text(PwdArea.decrypt(encrypted));
					target.parent().prepend("<i class='material-icons security'>security</i>");
				}
			});
		}, true);
	}
});
