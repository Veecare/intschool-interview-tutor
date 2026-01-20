import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, Users, GraduationCap, CheckCircle, Menu, X, LogOut } from 'lucide-react';

const InterviewTutor = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [subject, setSubject] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [tier, setTier] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(true);

  const subjects = [
    'English',
    'Biology',
    'Physics', 
    'Chemistry',
    'Computer Science',
    'History',
    'Geography',
    'PE',
    'Visual Arts',
    'Design Technology'
  ];

  const curriculums = ['IB MYP', 'IGCSE', 'IB Diploma', 'AP'];
  const tiers = ['Tier 1 (Elite)', 'Tier 2 (Established)', 'Tier 3 (Emerging)'];

  const questionCategories = [
    { id: 'safeguarding', name: 'Safeguarding & Child Protection', icon: Shield },
    { id: 'extracurricular', name: 'Extracurriculars & Co-curriculars', icon: Users },
    { id: 'subject', name: 'Subject-Specific Pedagogy', icon: BookOpen },
    { id: 'curriculum', name: 'Curriculum Expertise', icon: GraduationCap }
  ];

  const generateQuestion = async (category) => {
    setLoading(true);
    setFeedback('');
    setUserAnswer('');

    const tierContext = tier.includes('1') ? 'top-tier school with high expectations for innovation and research' :
                       tier.includes('2') ? 'established school with strong academic standards' :
                       'emerging school focused on practical teaching excellence';

    let prompt = '';
    
    if (category === 'safeguarding') {
      prompt = `Generate a realistic safeguarding interview question for a ${subject} teacher position at a ${tierContext} international school teaching ${curriculum}. The question should involve a scenario-based challenge about child protection, boundary management, or reporting procedures. Make it specific and challenging.`;
    } else if (category === 'extracurricular') {
      prompt = `Generate a realistic interview question about extracurricular activities for a ${subject} teacher at a ${tierContext} international school teaching ${curriculum}. Ask about specific clubs, activities, or co-curriculars they could contribute to beyond the classroom.`;
    } else if (category === 'subject') {
      prompt = `Generate a challenging subject-specific pedagogy question for a ${subject} teacher at a ${tierContext} international school teaching ${curriculum}. Focus on teaching methods, differentiation, or assessment strategies specific to ${subject}.`;
    } else {
      prompt = `Generate a curriculum-specific interview question for a ${subject} teacher at a ${tierContext} international school teaching ${curriculum}. Focus on the specific philosophy, requirements, or approaches of ${curriculum}.`;
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt + '\n\nProvide only the interview question, nothing else. Make it realistic and specific to international school hiring.'
          }]
        })
      });

      const data = await response.json();
      const question = data.content[0].text;
      
      setCurrentQuestion({ category, text: question });
      setLoading(false);
    } catch (error) {
      console.error('Error generating question:', error);
      setLoading(false);
    }
  };

  const getFeedback = async () => {
    if (!userAnswer.trim()) return;
    
    setLoading(true);

    const tierContext = tier.includes('1') ? 'top-tier school with high expectations' :
                       tier.includes('2') ? 'established school with strong standards' :
                       'emerging school focused on practical excellence';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an experienced international school hiring manager. A ${subject} teacher applying for a position at a ${tierContext} teaching ${curriculum} just answered this interview question:\n\nQuestion: ${currentQuestion.text}\n\nTheir answer: ${userAnswer}\n\nProvide constructive feedback on their answer. Include:\n1. What they did well\n2. What could be improved\n3. Specific suggestions for a stronger response\n4. Key points they should emphasize for international school interviews\n\nBe encouraging but honest.`
          }]
        })
      });

      const data = await response.json();
      const feedbackText = data.content[0].text;
      
      setFeedback(feedbackText);
      setQuestionHistory([...questionHistory, {
        question: currentQuestion.text,
        answer: userAnswer,
        feedback: feedbackText,
        category: currentQuestion.category
      }]);
      setLoading(false);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setLoading(false);
    }
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">IntSchool Interview Tutor</h1>
              </div>
              <button 
                onClick={() => setCurrentView('setup')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your International School Interview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI-powered interview preparation for teachers applying to IB, IGCSE, and AP programs worldwide. Practice with real questions from Tier 1, 2, and 3 international schools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {questionCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                  <Icon className="w-10 h-10 text-indigo-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                  <p className="text-gray-600 text-sm">Expert preparation for {cat.name.toLowerCase()} questions</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Professional Development Investment
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">$29.99/month</h3>
              <p className="text-gray-600">Unlimited interview practice • AI feedback • Question bank access</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Unlimited AI-generated questions across all subjects and curricula</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Personalized feedback on every answer from AI trained on international school hiring</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Questions tailored to Tier 1, 2, or 3 school expectations</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Safeguarding scenarios and extracurricular planning support</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Track your progress and review past practice sessions</p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('setup')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg"
            >
              Start Your Free 7-Day Trial
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">No credit card required for trial • Cancel anytime</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome! Let's Set Up Your Profile</h2>
            <p className="text-gray-600 mb-8">Tell us about the position you're preparing for</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Teaching Subject</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubject(s)}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        subject === s
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Curriculum</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {curriculums.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurriculum(c)}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        curriculum === c
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">School Tier</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {tiers.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        tier === t
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => subject && curriculum && tier && setCurrentView('practice')}
                disabled={!subject || !curriculum || !tier}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                  subject && curriculum && tier
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start Practice Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Interview Practice</h1>
              <p className="text-sm text-gray-600">{subject} • {curriculum} • {tier}</p>
            </div>
            <button 
              onClick={() => {
                setCurrentView('setup');
                setCurrentQuestion(null);
                setUserAnswer('');
                setFeedback('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Change Settings
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-lg mb-4">Question Categories</h3>
              <div className="space-y-3">
                {questionCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => generateQuestion(cat.id)}
                      disabled={loading}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                    >
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-left">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {questionHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Practice History</h4>
                  <p className="text-2xl font-bold text-indigo-600">{questionHistory.length}</p>
                  <p className="text-xs text-gray-500">questions completed</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!currentQuestion && !loading && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <GraduationCap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Practice?</h3>
                <p className="text-gray-600">Select a question category from the left to begin your interview preparation</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating your question...</p>
              </div>
            )}

            {currentQuestion && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {questionCategories.find(c => c.id === currentQuestion.category)?.name}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Question</h3>
                <p className="text-gray-700 leading-relaxed">{currentQuestion.text}</p>
              </div>
            )}

            {currentQuestion && !feedback && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your response here... Take your time and be specific."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  disabled={loading}
                />
                <button
                  onClick={getFeedback}
                  disabled={!userAnswer.trim() || loading}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Feedback
                </button>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Feedback</h3>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                  {feedback}
                </div>
                <button
                  onClick={() => {
                    setCurrentQuestion(null);
                    setUserAnswer('');
                    setFeedback('');
                  }}
                  className="mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Practice Another Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTutor;
