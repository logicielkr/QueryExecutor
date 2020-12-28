/*
 *
 * Copyright (C) HeonJik, KIM
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 */

package kr.graha.sample.queryexecutor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.SQLSyntaxErrorException;
import kr.graha.lib.Processor;
import kr.graha.lib.Record;
import kr.graha.lib.LogHelper;
import kr.graha.lib.Buffer;
import java.util.logging.Logger;

/**
 * Query Executor(그라하(Graha) 전처리기/후처리기)
 * Query 코드를 ajax 로 받아, 실행결과를 돌려준다.

 * @author HeonJik, KIM
 
 * @see kr.graha.lib.Processor
 
 * @version 0.9
 * @since 0.9
 */
public class QueryExecutorProcessorImpl implements Processor {
	
	private Logger logger = Logger.getLogger(this.getClass().getName());
	public QueryExecutorProcessorImpl() {
		
	}

/**
 * Graha 가 호출하는 메소드
 
 * @param request HttpServlet 에 전달된 HttpServletRequest
 * @param response HttpServlet 에 전달된 HttpServletResponse
 * @param params Graha 에서 각종 파라미터 정보를 담아서 넘겨준 객체
 * @param con 데이타베이스 연결(Connection)

 * @see javax.servlet.http.HttpServletRequest (Apache Tomcat 10 미만)
 * @see jakarta.servlet.http.HttpServletRequest (Apache Tomcat 10 이상)
 * @see javax.servlet.http.HttpServletResponse (Apache Tomcat 10 미만)
 * @see jakarta.servlet.http.HttpServletResponse (Apache Tomcat 10 이상)
 * @see kr.graha.lib.Record 
 * @see java.sql.Connection 
 */
	public void execute(HttpServletRequest request, HttpServletResponse response, Record params, Connection con) {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = params.getString("param.contents");
		if(sql == null || sql.trim().equals("")) {
			params.put("result.err", "sql is null or empty");
		}
		Buffer buffer = new Buffer();
		try {
			pstmt = con.prepareStatement(sql);
			if(pstmt.execute()) {
				rs = pstmt.getResultSet();
				ResultSetMetaData rsmd = rs.getMetaData();
				int index = 1;
				while(rs.next()) {
					params.put("result.column_count", rsmd.getColumnCount());
					for(int x = 1; x <= rsmd.getColumnCount(); x++) {
						if(index == 1) {
							params.put("result.column_name_" + x, rsmd.getColumnName(x));
						}
						params.put("result.column_data_" + index + "_" + x, rs.getString(x));
					}
					index++;
				}
				params.put("result.record_count", index - 1);
				rs.close();
				rs = null;
			} else {
				params.put("result.update_count", pstmt.getUpdateCount());
			}
			pstmt.close();
			pstmt = null;
		} catch (SQLException e) {
			params.put("result.error_message", e.getMessage());
			params.put("result.error_code", e.getErrorCode());
			params.put("result.sql_state", e.getSQLState());
		} finally {
			if(rs != null) {
				try {
					rs.close();
					rs = null;
				} catch(SQLException e) {}
			}
			if(pstmt != null) {
				try {
					pstmt.close();
					pstmt = null;
				} catch(SQLException e) {}
			}
		}
		

	}
}
