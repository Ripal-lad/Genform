using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Windows.Forms;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using TSFXGenform.Utils.GlobalUtils;

namespace TSFXGenform.Utils.Utils
{
    public class PDFDocumentRepository
   {
         /// <summary>
            /// Method to Open PDF file
            /// </summary>
            /// <param name="pdfPath"></param>
            /// <returns></returns>
            public PdfDocument Open(string pdfPath)
            {
                try
                {
                    var request = (HttpWebRequest) WebRequest.Create(pdfPath);
                    var response = request.GetResponse();
                    if (true)
                    {
                        byte[] bytes = null;
                        using (var stream = response.GetResponseStream())
                        {
                            if (stream != null)
                                using (var sr = new StreamReader(stream))
                                {
                                    var content = sr.ReadToEnd();
                                    var len = content.Length;
                                    bytes = Httpwebrequest(pdfPath, len);
                                    if (bytes.Length == 0) return null;
                                }
                        }
                        return Open(bytes);
                    }
                }
                catch (Exception ex)
                {
                    LogSystem.EmailLogException(ex, 0, "PdfDocuments : Open");
                    throw;
                }
            }

            
            /// <summary>
            /// Method to read PDF file
            /// </summary>
            /// <param name="pdfPath"></param>
            /// <param name="len"></param>
            /// <returns></returns>
            public byte[] Httpwebrequest(string pdfPath, int len)
            {
                try
                {
                    var request = (HttpWebRequest) WebRequest.Create(pdfPath);
                    var response = request.GetResponse();

                    byte[] bytes;
                    using (var stream = response.GetResponseStream())
                    {

                        using (var ms = new MemoryStream())
                        {
                            int count = 0;
                            do
                            {
                                var buf = new byte[len];
                                if (stream != null) count = stream.Read(buf, 0, len);
                                ms.Write(buf, 0, count);
                            } while (stream != null && (stream.CanRead && count > 0));
                            bytes = ms.ToArray();
                        }

                    }
                    return bytes;


                }
                catch (Exception ex)
                {
                    LogSystem.EmailLogException(ex, 1, "PdfDocuments : Open");
                    throw;
                }

            }

            /// <summary>
            /// Method to open PDF file - filearray argument
            /// </summary>
            /// <param name="fileArray"></param>
            /// <returns></returns>
            public PdfDocument Open(byte[] fileArray)
            {
                try
                {
                    return Open(new MemoryStream(fileArray));
                }
                catch (Exception ex)
                {
                    LogSystem.EmailLogException(ex, 1, "PdfDocuments : Open");
                    throw;
                }
            }

            /// <summary>
            /// Method to open PDF file - MemoryStream argument & using Itext sharp
            /// </summary>
            /// <param name="sourceStream"></param>
            /// <returns></returns>
            public PdfDocument Open(MemoryStream sourceStream)
            {
                PdfDocument outDoc;
                sourceStream.Position = 0;

                try
                {
                    outDoc = PdfReader.Open(sourceStream, PdfDocumentOpenMode.Import);
                }
                catch (PdfReaderException)
                {
                    sourceStream.Position = 0;
                    var outputStream = new MemoryStream();
                    var reader = new iTextSharp.text.pdf.PdfReader(sourceStream);
                    var pdfStamper = new iTextSharp.text.pdf.PdfStamper(reader, outputStream);
                    pdfStamper.FormFlattening = true;

                    //Setting PDF version
                    pdfStamper.Writer.SetPdfVersion(iTextSharp.text.pdf.PdfWriter.PDF_VERSION_1_4);
                    pdfStamper.Writer.CloseStream = false;
                    pdfStamper.Close();

                    outDoc = PdfReader.Open(outputStream, PdfDocumentOpenMode.Import);
                }

                return outDoc;
            }
        

        /// <summary>
        /// Method to get metadata for PDF 
        /// </summary>
        /// <param name="sourcePath"></param>
        public void ExtractMetadata(string sourcePath)
        {
            try
            {
                var document = PdfDocuments.CompatiblePdfReader.Open(sourcePath);

                MessageBox.Show(document.Info.Author.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.CreationDate.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.Creator.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.Keywords.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.ModificationDate.ToString(CultureInfo.InvariantCulture) +
                                Environment.NewLine +
                                document.Info.Producer.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.Subject.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Info.Title.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.FileSize.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.FullPath.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Guid.ToString() + Environment.NewLine +
                                document.Language.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.PageCount.ToString(CultureInfo.InvariantCulture) + Environment.NewLine +
                                document.Version.ToString(CultureInfo.InvariantCulture));
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "PdfDocuments : ExtractMetadata");
                throw;
            }
        }

    }
}
