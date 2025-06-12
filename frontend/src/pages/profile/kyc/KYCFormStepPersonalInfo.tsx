import { useState, useEffect } from "react";
import TextInput from "../../../components/inputs/TextInput";
import PhoneInput from "../../../components/PhoneInput";
import FormSelect from "../../../components/select/FormSelect";
import NextButton from "../../../components/NextButton";
import { genderOptions, ageRangeOptions } from "../../../utils/lookups";
import { statesLGAWardList } from "../../../utils/StateLGAWard";
import { countries } from "../../../utils/countries.js";
import { OptionType } from "../../../utils/lookups";

interface PersonalInfo {
  first_name: string;
  middle_name: string;
  last_name: string;
  user_name: string;
  phone_number: string;
  country_code: string;
  gender: string;
  lga: string;
  ward: string;
  age_range: string;
  state_of_origin: string;
  voting_engagement_state: string;
  citizenship: string;
  isVoter: string;
  willVote: string;
  country_of_residence: string;
}

interface Props {
  initialData?: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
}

const defaultValues: PersonalInfo = {
  first_name: "",
  middle_name: "",
  last_name: "",
  user_name: "",
  phone_number: "",
  country_code: "+234",
  gender: "",
  lga: "",
  ward: "",
  age_range: "",
  state_of_origin: "",
  voting_engagement_state: "",
  citizenship: "",
  isVoter: "",
  willVote: "",
  country_of_residence: "Nigeria",
};

export default function KYCFormStepPersonalInfo({ initialData, onNext }: Props) {
  const [formData, setFormData] = useState<PersonalInfo>(initialData || defaultValues);
  const [states, setStates] = useState<OptionType[]>([]);

  useEffect(() => {
    const stateOptions = statesLGAWardList.map((s, i) => ({
      id: i,
      label: s.state,
      value: s.state,
    }));
    setStates(stateOptions);
  }, []);

  const getLgas = (stateName: string): OptionType[] => {
    const found = statesLGAWardList.find(s => s.state === stateName);
    return found ? found.lgas.map((l, i) => ({ id: i, label: l.lga, value: l.lga })) : [];
  };

  const getWards = (lga: string, state: string): OptionType[] => {
    const stateData = statesLGAWardList.find(s => s.state === state);
    const lgaData = stateData?.lgas.find(l => l.lga === lga);
    return lgaData ? lgaData.wards.map((w, i) => ({ id: i, label: w, value: w })) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid max-w-6xl mx-auto w-full gap-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TextInput
          label="First Name"
          placeholder="e.g. Tolu"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          required
        />
        <TextInput
          label="Middle Name"
          placeholder="e.g. Emmanuel"
          value={formData.middle_name}
          onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
        />
        <TextInput
          label="Last Name"
          placeholder="e.g. Olumide"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          required
        />
        <TextInput
          label="Username or Nickname"
          placeholder="e.g. voteforchange"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          required
        />
        <FormSelect
          label="Gender"
          options={genderOptions}
          defaultSelected={formData.gender}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, gender: opt.value });
          }}
          required
        />
        <FormSelect
          label="Age Range"
          options={ageRangeOptions}
          defaultSelected={formData.age_range}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, age_range: opt.value });
          }}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Citizenship"
          options={[
            { id: 1, label: "Nigerian Citizen", value: "Nigerian Citizen" },
            { id: 2, label: "Diasporan", value: "Diasporan" },
            { id: 3, label: "Foreigner", value: "Foreigner" },
          ]}
          defaultSelected={formData.citizenship}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, citizenship: opt.value });
            if (opt?.value === "Nigerian Citizen") {
              setFormData({ ...formData, country_of_residence: "Nigeria" });
            } else {
              setFormData({ ...formData, country_of_residence: "" });
            }
          }}
          required
        />
        <FormSelect
          label="Country of Residence"
          options={countries}
          defaultSelected={formData.country_of_residence || "Nigeria"}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, country_of_residence: opt.value });
          }}
          required
        />
        <FormSelect
          label="Your State of Origin"
          options={states}
          defaultSelected={formData.state_of_origin}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, state_of_origin: opt.value });
          }}
          required
        />
        <PhoneInput
          label="WhatsApp Phone Number"
          defaultPhoneNumber={formData.phone_number}
          defaultCountryCode={formData.country_code}
          onChange={(num, code) => {
            setFormData({ ...formData, phone_number: num, country_code: code });
          }}
        />
        <FormSelect
          label="Voting State"
          options={states}
          defaultSelected={formData.voting_engagement_state}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, voting_engagement_state: opt.value });
          }}
          required
        />
        <FormSelect
          label="LGA"
          options={getLgas(formData.voting_engagement_state)}
          defaultSelected={formData.lga}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, lga: opt.value });
          }}
          required
        />
        <FormSelect
          label="Ward"
          options={getWards(formData.lga, formData.voting_engagement_state)}
          defaultSelected={formData.ward}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, ward: opt.value });
          }}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Are you a voter?"
          options={[
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ]}
          defaultSelected={formData.isVoter}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, isVoter: opt.value });
          }}
          required
        />
        <FormSelect
          label="Will you vote?"
          options={[
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ]}
          defaultSelected={formData.willVote}
          onChange={(opt) => {
            if (opt) setFormData({ ...formData, willVote: opt.value });
          }}
          required
        />
      </div>

      <div className="text-right max-w-[100px]">
        <NextButton content="Next" />
      </div>
    </form>
  );
}
