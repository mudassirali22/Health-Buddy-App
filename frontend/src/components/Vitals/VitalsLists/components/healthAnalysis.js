// Health analysis functions
export const analyzeBloodPressure = (systolic, diastolic) => {
  if (systolic < 90 || diastolic < 60) {
    return { score: 30, status: 'Low', description: 'Low blood pressure', risk: 'high' };
  } else if (systolic <= 120 && diastolic <= 80) {
    return { score: 100, status: 'Optimal', description: 'Perfect blood pressure', risk: 'low' };
  } else if (systolic <= 129 && diastolic <= 80) {
    return { score: 90, status: 'Normal', description: 'Normal blood pressure', risk: 'low' };
  } else if (systolic <= 139 || diastolic <= 89) {
    return { score: 70, status: 'Elevated', description: 'Elevated blood pressure', risk: 'medium' };
  } else if (systolic <= 159 || diastolic <= 99) {
    return { score: 50, status: 'High Stage 1', description: 'High blood pressure stage 1', risk: 'high' };
  } else if (systolic <= 179 || diastolic <= 119) {
    return { score: 30, status: 'High Stage 2', description: 'High blood pressure stage 2', risk: 'high' };
  } else {
    return { score: 10, status: 'Crisis', description: 'Hypertensive crisis', risk: 'critical' };
  }
};

export const analyzeBloodSugar = (sugar) => {
  if (sugar < 70) {
    return { score: 40, status: 'Low', description: 'Low blood sugar', risk: 'high' };
  } else if (sugar <= 99) {
    return { score: 100, status: 'Normal', description: 'Normal blood sugar', risk: 'low' };
  } else if (sugar <= 125) {
    return { score: 70, status: 'Prediabetes', description: 'Prediabetes range', risk: 'medium' };
  } else {
    return { score: 30, status: 'Diabetes', description: 'Diabetes range', risk: 'high' };
  }
};

export const analyzeHeartRate = (hr) => {
  if (hr >= 60 && hr <= 80) {
    return { score: 100, status: 'Excellent', description: 'Resting heart rate', risk: 'low' };
  } else if ((hr >= 50 && hr <= 59) || (hr >= 81 && hr <= 90)) {
    return { score: 80, status: 'Good', description: 'Normal heart rate', risk: 'low' };
  } else if ((hr >= 40 && hr <= 49) || (hr >= 91 && hr <= 100)) {
    return { score: 60, status: 'Fair', description: 'Slightly abnormal', risk: 'medium' };
  } else if ((hr >= 30 && hr <= 39) || (hr >= 101 && hr <= 120)) {
    return { score: 40, status: 'Poor', description: 'Abnormal heart rate', risk: 'high' };
  } else {
    return { score: 20, status: 'Critical', description: 'Dangerous heart rate', risk: 'critical' };
  }
};

export const analyzeTemperature = (temp) => {
  if (temp >= 97.8 && temp <= 99.1) {
    return { score: 100, status: 'Normal', description: 'Normal body temperature', risk: 'low' };
  } else if ((temp >= 96.8 && temp < 97.8) || (temp > 99.1 && temp <= 100.4)) {
    return { score: 70, status: 'Mild', description: 'Slightly abnormal temperature', risk: 'low' };
  } else if (temp >= 100.5 && temp <= 102.2) {
    return { score: 40, status: 'Fever', description: 'Fever detected', risk: 'medium' };
  } else {
    return { score: 20, status: 'Critical', description: 'Dangerous temperature', risk: 'high' };
  }
};

export const analyzeWeight = (weight) => {
  if (weight >= 50 && weight <= 90) {
    return { score: 90, status: 'Healthy', description: 'Healthy weight range', risk: 'low' };
  } else if ((weight >= 45 && weight < 50) || (weight > 90 && weight <= 100)) {
    return { score: 70, status: 'Moderate', description: 'Slightly outside ideal range', risk: 'low' };
  } else if ((weight >= 40 && weight < 45) || (weight > 100 && weight <= 120)) {
    return { score: 50, status: 'Risk', description: 'Weight health risk', risk: 'medium' };
  } else {
    return { score: 30, status: 'Critical', description: 'Critical weight condition', risk: 'high' };
  }
};

export const getDetailedHealthAnalysis = (vital) => {
  const analysis = {
    metrics: {},
    overallScore: 0,
    status: 'Unknown',
    color: 'gray',
    insights: [],
    warnings: [],
    recommendations: []
  };

  let totalScore = 0;
  let metricsCount = 0;

  // Analyze each metric
  if (vital.bloodPressure?.systolic) {
    const bpAnalysis = analyzeBloodPressure(vital.bloodPressure.systolic, vital.bloodPressure.diastolic);
    analysis.metrics.bloodPressure = bpAnalysis;
    totalScore += bpAnalysis.score;
    metricsCount++;
    if (bpAnalysis.risk === 'high' || bpAnalysis.risk === 'critical') {
      analysis.warnings.push(`Blood pressure is ${bpAnalysis.status.toLowerCase()} - ${bpAnalysis.description}`);
    }
  }

  if (vital.bloodSugar) {
    const sugarAnalysis = analyzeBloodSugar(vital.bloodSugar);
    analysis.metrics.bloodSugar = sugarAnalysis;
    totalScore += sugarAnalysis.score;
    metricsCount++;
    if (sugarAnalysis.risk === 'high' || sugarAnalysis.risk === 'critical') {
      analysis.warnings.push(`Blood sugar is ${sugarAnalysis.status.toLowerCase()} - ${sugarAnalysis.description}`);
    }
  }

  if (vital.heartRate) {
    const hrAnalysis = analyzeHeartRate(vital.heartRate);
    analysis.metrics.heartRate = hrAnalysis;
    totalScore += hrAnalysis.score;
    metricsCount++;
    if (hrAnalysis.risk === 'high' || hrAnalysis.risk === 'critical') {
      analysis.warnings.push(`Heart rate is ${hrAnalysis.status.toLowerCase()} - ${hrAnalysis.description}`);
    }
  }

  if (vital.temperature) {
    const tempAnalysis = analyzeTemperature(vital.temperature);
    analysis.metrics.temperature = tempAnalysis;
    totalScore += tempAnalysis.score;
    metricsCount++;
    if (tempAnalysis.risk === 'high' || tempAnalysis.risk === 'critical') {
      analysis.warnings.push(`Temperature is ${tempAnalysis.status.toLowerCase()} - ${tempAnalysis.description}`);
    }
  }

  if (vital.weight) {
    const weightAnalysis = analyzeWeight(vital.weight);
    analysis.metrics.weight = weightAnalysis;
    totalScore += weightAnalysis.score;
    metricsCount++;
    if (weightAnalysis.risk === 'high' || weightAnalysis.risk === 'critical') {
      analysis.warnings.push(`Weight is ${weightAnalysis.status.toLowerCase()} - ${weightAnalysis.description}`);
    }
  }

  // Calculate overall score and status
  analysis.overallScore = metricsCount > 0 ? Math.round(totalScore / metricsCount) : 0;

  if (analysis.overallScore >= 85) {
    analysis.status = 'Excellent';
    analysis.color = 'emerald';
    analysis.insights.push('All vital signs are in optimal range');
  } else if (analysis.overallScore >= 75) {
    analysis.status = 'Good';
    analysis.color = 'green';
    analysis.insights.push('Most vital signs are healthy');
  } else if (analysis.overallScore >= 65) {
    analysis.status = 'Fair';
    analysis.color = 'yellow';
    analysis.insights.push('Some vital signs need attention');
  } else if (analysis.overallScore >= 55) {
    analysis.status = 'Needs Attention';
    analysis.color = 'orange';
    analysis.insights.push('Multiple vital signs require monitoring');
  } else {
    analysis.status = 'Critical';
    analysis.color = 'red';
    analysis.insights.push('Immediate medical attention recommended');
  }

  // Generate recommendations
  if (analysis.warnings.length > 0) {
    analysis.recommendations.push('Consult with healthcare provider');
    analysis.recommendations.push('Monitor vital signs regularly');
  } else {
    analysis.recommendations.push('Maintain current healthy habits');
    analysis.recommendations.push('Continue regular monitoring');
  }

  return analysis;
};

export const getMetricCount = (vital) => {
  let count = 0;
  if (vital.bloodPressure?.systolic) count++;
  if (vital.bloodSugar) count++;
  if (vital.heartRate) count++;
  if (vital.temperature) count++;
  if (vital.weight) count++;
  return count;
};

export const getHealthTrend = (currentVital, previousVital) => {
  if (!previousVital) return { trend: 'new', change: 0 };
  const currentAnalysis = getDetailedHealthAnalysis(currentVital);
  const previousAnalysis = getDetailedHealthAnalysis(previousVital);
  const change = currentAnalysis.overallScore - previousAnalysis.overallScore;
  
  if (change > 5) return { trend: 'improving', change };
  if (change < -5) return { trend: 'declining', change };
  return { trend: 'stable', change };
};

export const getComprehensiveStats = (vitals) => {
  if (vitals.length === 0) return null;

  const analyses = vitals.map(vital => getDetailedHealthAnalysis(vital));
  const totalScore = analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0);
  const avgScore = Math.round(totalScore / vitals.length);

  const statusCounts = analyses.reduce((counts, analysis) => {
    counts[analysis.status] = (counts[analysis.status] || 0) + 1;
    return counts;
  }, {});

  const metricsCount = vitals.reduce((sum, vital) => sum + getMetricCount(vital), 0);

  return {
    totalRecords: vitals.length,
    avgHealthScore: avgScore,
    statusDistribution: statusCounts,
    totalMetrics: metricsCount
  };
};