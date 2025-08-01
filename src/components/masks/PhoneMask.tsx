import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

const PhoneMask = forwardRef<any, any>(function PhoneMask(props, ref) {
  const { onChange, name, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={[
        {
          mask: '(00) 0000-0000', // fixo: 10 dígitos
          regex: '^\\d{0,10}$',
        },
        {
          mask: '(00) 00000-0000', // celular: 11 dígitos
          regex: '^\\d{0,11}$',
        },
      ]}
      dispatch={(appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return dynamicMasked.compiledMasks.find(m => new RegExp(m.regex).test(number));
      }}
      definitions={{
        '0': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value: any) => {
        onChange({
          target: {
            name,
            value,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      overwrite
    />
  );
});


export default PhoneMask;