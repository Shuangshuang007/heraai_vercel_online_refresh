'use client';

import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

// 定义数据类型
interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface ResumeData {
  profile: ResumeProfile;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

interface ResumeSettings {
  fontSize?: number;
  fontFamily?: string;
  documentSize?: 'A4' | 'LETTER';
  themeColor?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  contact: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
    paddingLeft: 10,
  },
  skills: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },
  languages: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  institution: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 4,
  },
});

const ResumePDF = ({
  resume,
  settings = {},
  isPDF = true,
}: {
  resume: ResumeData;
  settings?: ResumeSettings;
  isPDF?: boolean;
}) => {
  const { profile, summary, experience, education, skills, languages } = resume;
  
  return (
    <Document title={`${profile.name} Resume`} author={profile.name} producer="HeraAI">
      <Page size={settings.documentSize || 'A4'} style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.headerName}>{profile.name}</Text>
          <Text style={styles.contact}>
            {profile.location} • {profile.phone} • {profile.email}
          </Text>
        </View>

        {/* Professional Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {/* Employment History */}
        {experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment History</Text>
            {experience.map((job, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.company}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </Text>
                <Text style={styles.date}>
                  {job.startDate} - {job.endDate}
                </Text>
                {job.description.map((point, pointIndex) => (
                  <Text key={pointIndex} style={styles.bulletPoint}>
                    • {point}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>{edu.institution}</Text>
                <Text style={styles.date}>
                  {edu.startDate} - {edu.endDate}
                </Text>
                {edu.description.map((point, pointIndex) => (
                  <Text key={pointIndex} style={styles.bulletPoint}>
                    • {point}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>
              {skills.join(' • ')}
            </Text>
          </View>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.languages}>
              {languages.join(' • ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF; 