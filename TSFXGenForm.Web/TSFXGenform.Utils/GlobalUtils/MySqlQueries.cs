namespace TSFXGenform.Utils.GlobalUtils
{
    public class MySqlQueries
    {
        public const string GetStateAveragesForFirstAttemptMedScore =
            "select IFNULL(AVG(t1.ScoreOnMax),0) as MedianScore FROM (SELECT @rownum:=@rownum+1 as `RowNumber`,qrs.TotalScore/qrs.MaxScore as ScoreOnMax FROM quizresultsummary qrs,(SELECT @rownum:=0)r WHERE qrs.QuizDefineId = " +
            "{0}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.AttemptNumber=1 ORDER BY qrs.TotalScore)as t1,(SELECT COUNT(*) as TotalRows FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " +
            "{1}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.AttemptNumber=1) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows+1/2), FLOOR(TotalRows+2/2));";

        public const string GetStateAveragesForFirstAttemptMedTimeTaken =
            "select IFNULL(AVG(t1.TotalTimeTaken),0) as MedianTotalTimeTaken FROM (SELECT @rownum:=@rownum + 1 as `RowNumber`,qrs.TotalTimeTaken as TotalTimeTaken FROM quizresultsummary qrs, (SELECT @rownum:=0) r WHERE qrs.QuizDefineId = " + 
            "{0}" + 
            " AND qrs.EndDate IS NOT NULL AND qrs.AttemptNumber = 1 ORDER BY qrs.TotalScore) as t1, (SELECT COUNT(*) as TotalRows FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " + 
            "{1}" + 
            " AND qrs.EndDate IS NOT NULL AND qrs.AttemptNumber = 1) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows + 1 / 2) , FLOOR(TotalRows + 2 / 2));";

        public const string GetStateAveragesForBestAttemptMedScore =
            "SELECT IFNULL(AVG(t1.ScoreOnMax),0) as MedianScore FROM (SELECT @rownum:=@rownum+1 as `RowNumber`,qrs.TotalScore/qrs.MaxScore as ScoreOnMax FROM quizresultsummary qrs,(SELECT @rownum:=0)r WHERE qrs.QuizDefineId = " +
            "{0}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.IsBestScore= true ORDER BY qrs.TotalScore)as t1,(SELECT COUNT(*) as TotalRows FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " +
            "{1}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.IsBestScore=true) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows+1/2), FLOOR(TotalRows+2/2));";

        public const string GetStateAveragesForBestAttemptMedTimeTaken =
            "SELECT IFNULL(AVG(t1.TotalTimeTaken),0) as MedianTimeTaken FROM ( SELECT @rownum:=@rownum+1 as `RowNumber`,qrs.TotalTimeTaken FROM quizresultsummary qrs,(SELECT @rownum:=0)r WHERE qrs.QuizDefineId = " +
            "{0}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.IsBestScore= true ORDER BY qrs.TotalScore)as t1,(SELECT COUNT(*) as TotalRows FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " +
            "{1}" +
            " AND qrs.EndDate IS NOT NULL AND qrs.IsBestScore=true) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows+1/2), FLOOR(TotalRows+2/2));";

        public const string GetStateAveragesForCurrentAttemptMedScore =
            "SELECT IFNULL(AVG(t1.ScoreOnMax),0) as MedianScore FROM (SELECT @rownum:=@rownum+1 as `RowNumber`,qrs.TotalScore/qrs.MaxScore as ScoreOnMax FROM quizresultsummary qrs,(SELECT @rownum:=0)r WHERE qrs.QuizDefineId =" +
            "{0}" +
            " AND qrs.EndDate IS NOT NULL GROUP BY qrs.UserId ORDER BY qrs.TotalScore)as t1,(SELECT COUNT(*) as TotalRows FROM (SELECT * FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " +
            "{1}" +
            " AND qrs.EndDate IS NOT NULL GROUP BY qrs.UserId) AS TEMP) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows+1/2), FLOOR(TotalRows+2/2))";

        //public const string GetStateAveragesForCurrentAttemptMedTimeTaken =
        //    "SELECT IFNULL(AVG(t1.TotalTimeTaken),0) as MedianTimeTaken FROM (SELECT @rownum:=@rownum+1 as `RowNumber`,qrs.TotalTimeTaken FROM quizresultsummary qrs,(SELECT @rownum:=0)r WHERE qrs.QuizDefineId = " +
        //    "{0}" +
        //    " AND qrs.EndDate IS NOT NULL GROUP BY qrs.UserId ORDER BY qrs.TotalScore)as t1,(SELECT COUNT(*) as TotalRows FROM (SELECT * FROM quizresultsummary qrs WHERE qrs.QuizDefineId = " +
        //    "{0}" +
        //    " AND qrs.EndDate IS NOT NULL GROUP BY qrs.UserId) AS TEMP) as t2 WHERE 1 AND t1.RowNumber IN (FLOOR(TotalRows+1/2), FLOOR(TotalRows+2/2))";

        public const string GetAverageScoreBasedOnFirstAttempt =
            "SELECT IFNULL(AVG(qr.Score),0) AS AvgScore FROM quizresult qr INNER JOIN quizdefine qd ON qd.QuizDefineId = qr.QuizDefineId INNER JOIN quizcompilation qc ON qc.QuizCompileId = qr.QuizCompileId INNER JOIN quizresultsummary qrs ON qrs.QuizDefineId = qd.QuizDefineId AND qrs.AttemptNumber = 1 INNER JOIN mappingquizresultdetails mqr ON mqr.QuizResultSummaryId = qrs.QuizResultSummaryId AND mqr.QuizCompileId = qc.QuizCompileId AND mqr.QuizResultId = qr.QuizResultId WHERE qd.Id = " +
            "{0}" + " AND qr.QuestionId = " + "{1}" + " GROUP BY qrs.QuizDefineId, qr.QuestionId";

        public const string GetAverageScoreBasedOnBestScore =
            "SELECT IFNULL(AVG(qr.Score),0) AS AvgScore FROM quizresult qr INNER JOIN quizdefine qd ON qd.QuizDefineId = qr.QuizDefineId INNER JOIN quizcompilation qc ON qc.QuizCompileId = qr.QuizCompileId INNER JOIN quizresultsummary qrs ON qrs.QuizDefineId = qd.QuizDefineId AND qrs.IsBestScore=true INNER JOIN mappingquizresultdetails mqr ON mqr.QuizResultSummaryId = qrs.QuizResultSummaryId AND mqr.QuizCompileId = qc.QuizCompileId AND mqr.QuizResultId = qr.QuizResultId WHERE qd.Id = " +
            "{0}" + " AND qr.QuestionId = " + "{1}" + " GROUP BY qrs.QuizDefineId, qr.QuestionId";

        public const string GetAverageScoreBasedOnCurrentScore =
            "SELECT IFNULL(AVG(qr.Score),0) AS AvgScore FROM quizresult qr INNER JOIN quizdefine qd ON qd.QuizDefineId = qr.QuizDefineId INNER JOIN quizcompilation qc ON qc.QuizCompileId = qr.QuizCompileId INNER JOIN quizresultsummary qrs ON qrs.QuizDefineId = qd.QuizDefineId AND qrs.quizresultsummaryId IN (SELECT MAX(quizresultsummaryId) FROM quizresultsummary qrs WHERE qrs.QuizDefineId = qd.QuizDefineId AND qrs.EndDate IS NOT NULL GROUP BY qrs.UserId) INNER JOIN mappingquizresultdetails mqr ON mqr.QuizResultSummaryId = qrs.QuizResultSummaryId AND mqr.QuizCompileId = qc.QuizCompileId AND mqr.QuizResultId = qr.QuizResultId WHERE qd.Id = " +
            "{0}" + " AND qr.QuestionId =" + "{1}" + "";

        public const string GetQuizResultSummaryHighScore =
            "SELECT IFNULL(MAX(qrs.TotalScore),0) as HighScore FROM quizresultsummary qrs WHERE qrs.QuizDefineId =" + "{0}" +
            " AND qrs.UserId = " + "{1}";
    }
}
