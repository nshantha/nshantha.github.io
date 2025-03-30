import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skills = [
    { name: 'Java/Spring Boot', level: 95 },
    { name: 'Microservices', level: 90 },
    { name: 'AWS (EKS, S3, DynamoDB)', level: 85 },
    { name: 'Kafka', level: 90 },
    { name: 'Neo4J/PostgreSQL', level: 85 },
    { name: 'Python', level: 85 },
    { name: 'Docker/Kubernetes', level: 80 },
    { name: 'PyTorch/TensorFlow', level: 75 },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  }

  return (
    <div className="pt-20">
      {/* About Me Section */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-secondary/20 rounded-lg blur-lg"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                {/* <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                  alt="Nitesh's Portrait" 
                  className="w-full h-auto"
                /> */}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-6">About Me</h1>
            <div className="space-y-4 text-gray-600 dark:text-muted">
              <p>
                Hello! I'm Nitesh, a Software Engineer at Nordstrom specializing in high-throughput distributed systems 
                and microservices architecture with a unique background in ML/Robotics research.
              </p>
              <p>
                At Nordstrom, I lead the development of enterprise-scale promotion and pricing platforms that process 
                millions of transactions daily. My work has directly contributed to driving over $100M in quarterly revenue 
                through platform enhancements.
              </p>
              <p>
                Prior to Nordstrom, I conducted Autonomous Vehicle research at the LANDR lab at the University at Buffalo,
                where I developed motion prediction algorithms using ResNet-LSTM architectures and implemented
                Kalman filter-based sensor fusion for accurate localization.
              </p>
              <p>
                I'm passionate about solving complex engineering challenges and continuously exploring emerging technologies.
                Currently, I'm diving deep into LLMs and distributed systems architecture.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="section-container bg-gray-50 dark:bg-gray-900/30 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-600 dark:text-muted max-w-2xl mx-auto">
            My expertise spans enterprise distributed systems, cloud technologies, and AI/ML.
          </p>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              custom={index}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-secondary">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-secondary h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="section-container">
        <h2 className="text-3xl font-bold mb-8 text-center">Experience & Education</h2>
        
        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="relative border-l-2 border-secondary/30 pl-8 ml-4 space-y-12">
            {/* Experience Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-12 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <span className="text-secondary font-mono text-sm">Aug 2021 - Present</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Software Engineer</h3>
                <p className="text-gray-500 dark:text-gray-400">Nordstrom, Seattle</p>
                <p className="mt-3 text-gray-600 dark:text-muted">
                  Leading development of enterprise-scale promotion and pricing platforms. Building microservices with 
                  Java/Spring Boot, event-driven architecture with Kafka, and cloud solutions with AWS.
                </p>
              </div>
            </motion.div>
            
            {/* Experience Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-12 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <span className="text-secondary font-mono text-sm">Sep 2019 - May 2021</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Graduate Research Assistant</h3>
                <p className="text-gray-500 dark:text-gray-400">University at Buffalo, NY</p>
                <p className="mt-3 text-gray-600 dark:text-muted">
                  Conducted Autonomous Vehicle research at LANDR lab. Developed motion prediction algorithms using 
                  ResNet-LSTM architecture and implemented Kalman filter-based sensor fusion for localization.
                </p>
              </div>
            </motion.div>
            
            {/* Experience Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -left-12 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <span className="text-secondary font-mono text-sm">May 2016 - May 2019</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Software Engineer</h3>
                <p className="text-gray-500 dark:text-gray-400">Ak Aerotek, Bengaluru, India</p>
                <p className="mt-3 text-gray-600 dark:text-muted">
                  Verified and validated safety-critical systems adhering to DO178B/C guidelines. Led a team of 6 for
                  reviews and audit reviews, reducing error rates by 90% for delivery.
                </p>
              </div>
            </motion.div>
            
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -left-12 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <span className="text-secondary font-mono text-sm">Aug 2019 - Jun 2021</span>
                <h3 className="text-xl font-bold mt-1 mb-2">M.S. in Engineering Sciences (Robotics)</h3>
                <p className="text-gray-500 dark:text-gray-400">University at Buffalo, NY</p>
                <p className="mt-3 text-gray-600 dark:text-muted">
                  Focused on robotics, autonomous vehicles, and machine learning. Conducted research in the LANDR lab 
                  under Prof. Chunming Qiao.
                </p>
              </div>
            </motion.div>

            {/* Education 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-12 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <span className="text-secondary font-mono text-sm">Sep 2011 - Jul 2015</span>
                <h3 className="text-xl font-bold mt-1 mb-2">B.E. in Electronics and Communication</h3>
                <p className="text-gray-500 dark:text-gray-400">Visvesvaraya Technological University, India</p>
                <p className="mt-3 text-gray-600 dark:text-muted">
                  Studied electronics, communication systems, and computational engineering with a focus on
                  embedded systems and signal processing.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 