// ...existing code from src/pages/Assessments.tsx...

// function Assessments() {
//   const [assessments, setAssessments] = useState<Assessment[]>([]);
//   const navigate = useNavigate();
//   import { useEffect, useState } from 'react';
//   import { useNavigate } from 'react-router-dom';
//   import { Layout } from '@/components/layout/Layout';
//   import { db, Assessment } from '@/lib/database';

//   export default function Assessments() {
//     const [assessments, setAssessments] = useState<Assessment[]>([]);
//     const navigate = useNavigate();
//     useEffect(() => {
//       db.assessments.toArray().then(setAssessments);
//     }, []);
//     return (
//       <Layout>
//         <h2 className="text-2xl font-bold mb-4">Assessments</h2>
//         <ul className="space-y-2">
//           {assessments.map(assessment => (
//             <li
//               key={assessment.id}
//               className="p-2 border rounded cursor-pointer hover:bg-muted"
//               onClick={() => navigate(`/assessment/${assessment.jobId}`)}
//             >
//               <strong>{assessment.title}</strong> — {assessment.description}
//             </li>
//           ))}
//         </ul>
//       </Layout>
//     );
//   }
//   useEffect(() => {
//     db.assessments.toArray().then(setAssessments);
//   }, []);
//   return (
//     <Layout>
//       <h2 className="text-2xl font-bold mb-4">Assessments</h2>
//       <ul className="space-y-2">
//         {assessments.map(assessment => (
//           <li
//             key={assessment.id}
//             className="p-2 border rounded cursor-pointer hover:bg-muted"
//             onClick={() => navigate(`/assessment/${assessment.jobId}`)}
//           >
//             <strong>{assessment.title}</strong> — {assessment.description}
//           </li>
//         ))}
//       </ul>
//     </Layout>
//   );
// }

// export default Assessments;



// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/layout/Layout';
// import { db, Assessment } from '@/lib/database';

// export default function Assessments() {
//   const [assessments, setAssessments] = useState<Assessment[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     db.assessments.toArray().then(setAssessments).catch((error) => {
//       console.error('Failed to fetch assessments:', error);
//     });
//   }, []);

//   return (
//     <Layout>
//       <h2 className="text-2xl font-bold mb-4">Assessments</h2>
//       {assessments.length > 0 ? (
//         <ul className="space-y-2">
//           {assessments.map((assessment) => (
//             <li
//               key={assessment.id}
//               className="p-2 border rounded cursor-pointer hover:bg-muted"
//               onClick={() => navigate(`/assessment/${assessment.jobId}`)}
//             >
//               <strong>{assessment.title}</strong> - {assessment.description}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No assessments available.</p>
//       )}
//     </Layout>
//   );
// }


// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/layout/Layout';
// import { db, Assessment } from '@/lib/database';

// export default function Assessments() {
//   const [assessments, setAssessments] = useState<Assessment[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     db.assessments.toArray().then(setAssessments).catch((error) => {
//       console.error('Failed to fetch assessments:', error);
//     });
//   }, []);

//   useEffect(() => {
//     db.assessments.toArray().then((data) => {
//       console.log('Fetched assessments:', data);
//       setAssessments(data);
//     }).catch((error) => {
//       console.error('Error:', error);
//     });
//   }, []);

//   return (
//     <Layout>
//       <h2 className="text-2xl font-bold mb-4">Assessments</h2>
//       <ul className="space-y-2">
//         {assessments.length > 0 ? (
//           assessments.map((assessment) => (
//             <li
//               key={assessment.id}
//               className="p-2 border rounded cursor-pointer hover:bg-muted"
//               onClick={() => navigate(`/assessment/${assessment.jobId}`)}
//             >
//               <strong>{assessment.title}</strong> — {assessment.description}
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-500">No assessments available.</p>
//         )}
//       </ul>
//     </Layout>
//   );
// }



// with pagination
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { db, Assessment } from '@/lib/database';

function Assessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    db.assessments.count().then(setTotal);
    db.assessments
      .orderBy('createdAt')
      .reverse()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()
      .then(setAssessments)
      .catch((error) => {
        console.error('Error fetching assessments:', error);
      });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
          onClick={() => navigate('/Create-assessment')}
        >
          Create Assessment
        </button>
      </div>
      <ul className="space-y-2">
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <li
              key={assessment.id}
              className="p-2 border rounded cursor-pointer hover:bg-muted"
              onClick={() => navigate(`/assessment/${assessment.jobId}`)}
            >
              <strong>{assessment.title}</strong> — {assessment.description}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No assessments available.</p>
        )}
      </ul>
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}

export default Assessments;