import { motion } from 'framer-motion'
import { FiDownload, FiCode, FiBriefcase, FiBook, FiAward, FiExternalLink, FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi'

const Resume = () => {
  const skills = {
    languages: ["Java", "Python", "C++", "SQL"],
    frameworks: ["Spring Boot", "Kafka", "TensorFlow", "PyTorch", "OpenCV", "ROS Kinetic", "Autoware", "MATLAB", "Sci-Kit-Learn", "NLTK"],
    tools: ["AWS (EKS, S3, DynamoDB)", "Neo4J", "PostgreSQL", "Redis Elasticache", "Docker", "Kubernetes", "New Relic", "Splunk", "JMETER"]
  }
  
  const contact = {
    email: "nithesh1001@gmail.com",
    phone: "716-431-8762",
    linkedin: "https://www.linkedin.com/in/niteshs1001/",
    github: "https://github.com/nshantha"
  }
  
  const experiences = [
    {
      position: "Software Engineer",
      company: "Nordstrom, Seattle",
      period: "Aug 2021 - Present",
      description: "Developing and enhancing features for a Tier 1 microservice using Java and Spring Boot, which evaluates and applies promotions, services and ensures accurate pricing at the cart level for checkout, processing all Omni Channel orders.",
      achievements: [
        "Developing and enhancing promotion's platform which empowers business users the ability to author promotions at various hierarchy levels, driving over $100 million in quarterly revenue growth",
        "Designed and implemented algorithms to accurately evaluate a range of promotions to drive enticements for Products",
        "Unified digital and in-store systems through API design and implementation, enabling real-time access to promotions",
        "Developed and implemented shipping, override, and surcharge services impacting over $2 million in order value",
        "Designed event-driven architecture to ingest and process competitor pricing data, providing analytics team with insights into industry trends",
        "Built scalable APIs to determine item salability in real-time using a rules engine and Kafka data streams across microservices",
        "Built and managed a custom CI/CD pipeline on Kubernetes to automate service deployment and management",
        "Utilized AWS services such as EKS, S3, and RDS/DynamoDB for deployment, storage, and data management",
        "Utilized Neo4J Database as a datastore to store and query Nordstrom data to enable promotions evaluation and authoring",
        "Implemented application operations, monitoring and alerts using New Relic and Splunk log analysis to identify bottlenecks",
        "Actively participated in code reviews, ensuring adherence to best practices, and maintaining code quality",
        "Used JMETER for performance testing of applications to ensure stability and scalability under high traffic conditions"
      ]
    },
    {
      position: "Graduate Research Assistant",
      company: "University at Buffalo, NY",
      period: "Sep 2019 - May 2021",
      description: "Conducted Autonomous Vehicle research at LANDR lab under Prof. Chunming Qiao.",
      achievements: [
        "Used Pytorch to develop a motion prediction algorithm using a ResNet-LSTM architecture to forecast traffic agent trajectories",
        "Implemented Kalman filter-based sensor fusion for accurate localization using LiDAR and radar data",
        "Developed a YOLO-based object detection system integrated with our camera network",
        "Developed ROS node to integrate radar data with Autoware for object detection, tracking, and visualization"
      ]
    },
    {
      position: "Software Engineer",
      company: "Ak Aerotek, Bengaluru, India",
      period: "May 2016 - May 2019",
      description: "Conducted verification and validation of safety-critical systems adhering to DO178B/C guidelines.",
      achievements: [
        "Performed HSIT to prepare test scripts to produce Ada-Test Harness and executed in target environment",
        "Conducted technical reviews of test plans, scripts, results, and HLR with respect to system requirements",
        "Prepared test plans from High-Level Requirement (HLR) for aircraft engine temperature and pressure",
        "Led a team of 6 for reviews and audit reviews of developers to reduce the error rate by 90% for delivery"
      ]
    }
  ]
  
  const education = [
    {
      degree: "M.S. in Engineering Sciences (Robotics)",
      institution: "University at Buffalo, NY",
      period: "Aug 2019 - Jun 2021",
      description: "Focused on robotics, autonomous vehicles, and machine learning.",
      achievements: [
        "Research focus: Autonomous vehicles and computer vision",
        "Worked in LANDR lab under Prof. Chunming Qiao",
        "Specialized in sensor fusion and motion prediction algorithms"
      ]
    },
    {
      degree: "B.E. in Electronics and Communication",
      institution: "Visvesvaraya Technological University, India",
      period: "Sep 2011 - Jul 2015",
      description: "Studied electronics, communication systems, and computational engineering.",
      achievements: [
        "Focus on embedded systems and signal processing",
        "Completed projects in digital signal processing and electronics"
      ]
    }
  ]
  
  const certifications = [
    {
      name: "Deep Learning Specialization",
      issuer: "Coursera",
      date: "Jun 2020",
      credentialId: "M94A2658PVGQ",
      link: "https://www.coursera.org/account/accomplishments/specialization/certificate/M94A2658PVGQ"
    }
  ]
  
  const downloadResume = () => {
    // In a real implementation, this would download a PDF file
    alert("In a real implementation, this would download a PDF file of your resume.")
  }
  
  return (
    <div className="pt-20 min-h-screen">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="mb-4">NITESH SHANTHA KUMAR</h1>
          
          {/* Contact Information */}
          <div className="flex justify-center gap-4 flex-wrap mb-6">
            <a 
              href={`mailto:${contact.email}`} 
              className="inline-flex items-center text-gray-600 dark:text-muted hover:text-accent dark:hover:text-accent transition-colors"
            >
              <FiMail className="mr-2" />
              {contact.email}
            </a>
            <a 
              href={`tel:${contact.phone}`} 
              className="inline-flex items-center text-gray-600 dark:text-muted hover:text-accent dark:hover:text-accent transition-colors"
            >
              <FiPhone className="mr-2" />
              {contact.phone}
            </a>
            <a 
              href={contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 dark:text-muted hover:text-accent dark:hover:text-accent transition-colors"
            >
              <FiLinkedin className="mr-2" />
              LinkedIn
            </a>
            <a 
              href={contact.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 dark:text-muted hover:text-accent dark:hover:text-accent transition-colors"
            >
              <FiGithub className="mr-2" />
              GitHub
            </a>
          </div>
          
          <p className="text-gray-600 dark:text-muted text-lg mb-6">
            Software Engineer specializing in distributed systems, microservices architecture, and AI/ML applications.
          </p>
          <button 
            onClick={downloadResume}
            className="btn-primary inline-flex items-center"
          >
            <FiDownload className="mr-2" />
            Download Resume
          </button>
        </div>
        
        {/* Skills Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiCode className="mr-2 text-accent" />
            Technical Skills
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Frameworks & Libraries</h3>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Tools & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Technical Impact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiAward className="mr-2 text-accent" />
            Technical Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-accent mb-2">$100M+</div>
              <p className="text-gray-600 dark:text-muted">
                Quarterly revenue driven through promotion platform enhancements
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-accent mb-2">99.99%</div>
              <p className="text-gray-600 dark:text-muted">
                Uptime maintained for business-critical services
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-accent mb-2">$2M+</div>
              <p className="text-gray-600 dark:text-muted">
                Order volume processed through fulfillment services
              </p>
            </div>
          </div>
        </motion.section>
        
        {/* Work Experience */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiBriefcase className="mr-2 text-accent" />
            Work Experience
          </h2>
          
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-accent"
              >
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{exp.position}</h3>
                  <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">{exp.company}</p>
                <p className="text-gray-600 dark:text-muted mb-4">{exp.description}</p>
                
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Achievements:</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-muted space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>
        
        {/* Education */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiBook className="mr-2 text-accent" />
            Education
          </h2>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-accent"
              >
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">
                    {edu.period}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">{edu.institution}</p>
                <p className="text-gray-600 dark:text-muted mb-4">{edu.description}</p>
                
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Highlights:</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-muted space-y-1">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>
        
        {/* Certifications */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiAward className="mr-2 text-accent" />
            Certifications
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-accent"
              >
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{cert.name}</h3>
                  <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">
                    {cert.date}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">{cert.issuer}</p>
                <p className="text-gray-600 dark:text-muted mb-4">Credential ID: {cert.credentialId}</p>
                
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent hover:underline"
                >
                  <span>Show credential</span>
                  <FiExternalLink className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Resume 