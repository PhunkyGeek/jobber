import JobForm from '../../components/JobForm';

export default function CreateJobPage(){
  return (
    <div className="p-6">
      <button onClick={() => history.back()} className="mb-4 text-blue-900 font-medium"><span className="text-xl mr-2">&larr;</span> Go back</button>
      <h2 className="text-xl font-bold mb-4">Create Job</h2>
      <JobForm />
    </div>
  );
}
