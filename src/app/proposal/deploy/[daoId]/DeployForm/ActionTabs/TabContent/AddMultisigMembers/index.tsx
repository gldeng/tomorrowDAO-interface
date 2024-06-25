import { FormInstance } from 'antd';
import FormMembersItem from 'components/FormMembersItem';

interface IAddMultisigMembersProps {
  form: FormInstance;
}
function AddMultisigMembers(props: IAddMultisigMembersProps) {
  const { form } = props;
  return <FormMembersItem name={['aaa', 'value']} initialValue={['']} form={form} />;
}

export default AddMultisigMembers;
