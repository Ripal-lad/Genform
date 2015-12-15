using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    [XmlRoot("Resources")]
    public class Resources 
    {
        [XmlElement("Resource")]
        public  List<Resource> ListOfResourceses { get; set; }

    }
    
    public class Resource
    {
        public int Id { get; set; }
        public int MediaHandlerId { get; set; }
        public string Title { get; set; }
        public string FileSizes { get; set; }

        public string CalculatedPdfFileSizesinKb { get; set; }
        public string FilePages { get; set; }
        public string FileNames { get; set; }
        public string HiddenCode { get; set; }
        public string URL { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string ResourceLinkImagePath { get; set; }
        
        [XmlIgnore]
        public DateTime CreateDateTime { get; set; }

        [XmlElement("CreateDateTime")]
        public string FormattedCreateDateTime
        {
            get { return CreateDateTime.ToString("yyyy-MM-dd HH:mm:ss"); }
            set { CreateDateTime = DateTime.Parse(value); }
        }

        public bool IsRunningLocally { get; set; }
    }
}
