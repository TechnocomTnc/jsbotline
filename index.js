    var conn = new sql.ConnectionPool(dbConfig);
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        // req.query("INSERT INTO [dbo].[groupName] ([groupID],[Gname]) VALUES ('" + gid + "','" + gid + "')")
        req.query("CREATE TABLE [dbo].["+ uid +"]([m_Id] [int] IDENTITY(1,1) NOT NULL,[UID] [varchar](500) NULL,[Mesg] [varchar](500) NULL)")                      
    });
