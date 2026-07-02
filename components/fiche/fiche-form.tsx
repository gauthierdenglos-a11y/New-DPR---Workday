"use client";

import { type ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TonePicker } from "@/components/fiche/tone-picker";
import { createFiche, updateFiche } from "@/lib/actions/fiche";
import {
  BESOIN_SUPPORT_KEYS,
  BESOIN_SUPPORT_LABELS,
  CAUSE_KEYS,
  CAUSE_LABELS,
  DEFAULT_FICHE_VALUES,
  FREIN_IA,
  FREIN_IA_LABELS,
  GAIN_IA,
  GAIN_IA_LABELS,
  IA_PHASE_KEYS,
  IA_PHASE_LABELS,
  IA_UTILISEE,
  IA_UTILISEE_LABELS,
  IMPACT,
  IMPACT_LABELS,
  METEO_EQUIPE_LABELS,
  PHASE,
  PHASE_LABELS,
  PROBABILITE,
  PROBABILITE_LABELS,
  RELATION_CLIENT_LABELS,
  STATUT_GLOBAL_LABELS,
  STATUT_GLOBAL_LEGENDE,
  STATUT_PLAN,
  STATUT_PLAN_LABELS,
  TYPE_PROJET,
  TYPE_PROJET_LABELS,
  ficheFormSchema,
  type FicheFormValues,
} from "@/lib/validations/fiche";

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function FicheForm({
  mode,
  ficheId,
  defaultValues,
}: {
  mode: "create" | "edit";
  ficheId?: string;
  defaultValues?: FicheFormValues;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [autreCauseCoche, setAutreCauseCoche] = useState(
    defaultValues?.causes.autre ?? false,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FicheFormValues>({
    resolver: zodResolver(ficheFormSchema),
    defaultValues: defaultValues ?? DEFAULT_FICHE_VALUES,
  });

  const onSubmit = (values: FicheFormValues) => {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createFiche(values);
        } else if (ficheId) {
          await updateFiche(ficheId, values);
        }
      } catch (error) {
        // redirect() lève une exception normale côté Next.js : on ne la traite pas comme une erreur
        if (
          error instanceof Error &&
          (error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
        ) {
          throw error;
        }
        toast.error("Impossible d'enregistrer la fiche. Réessayez.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Fiche de Suivi Projet
          </h1>
          <p className="text-sm text-muted-foreground">
            Édition de l&apos;état d&apos;avancement et analyse de la performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/fiches")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer la fiche"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Date de mise à jour" error={errors.dateMiseAJour?.message}>
                <Input type="date" {...register("dateMiseAJour")} />
              </Field>
              <Field label="Nom du projet" error={errors.projet?.message}>
                <Input placeholder="ex : Refonte Core Banking" {...register("projet")} />
              </Field>
              <Field label="Client" error={errors.client?.message}>
                <Input placeholder="ex : Banque XYZ" {...register("client")} />
              </Field>
              <Field
                label="Responsable pilotage (DP/CP)"
                error={errors.responsablePilotage?.message}
              >
                <Input placeholder="Nom du DP/CP" {...register("responsablePilotage")} />
              </Field>
              <Field label="Type d'engagement sur le projet">
                <Controller
                  control={control}
                  name="typeProjet"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value: string) => TYPE_PROJET_LABELS[value as (typeof TYPE_PROJET)[number]]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_PROJET.map((value) => (
                          <SelectItem key={value} value={value}>
                            {TYPE_PROJET_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Phase actuelle du projet">
                <Controller
                  control={control}
                  name="phaseActuelle"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value: string) => PHASE_LABELS[value as (typeof PHASE)[number]]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PHASE.map((value) => (
                          <SelectItem key={value} value={value}>
                            {PHASE_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compréhension de la Dérive</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Causes principales
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CAUSE_KEYS.map((key) => (
                    <Controller
                      key={key}
                      control={control}
                      name={`causes.${key}`}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          {CAUSE_LABELS[key]}
                        </label>
                      )}
                    />
                  ))}
                  <Controller
                    control={control}
                    name="causes.autre"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setAutreCauseCoche(Boolean(checked));
                          }}
                        />
                        Autre (préciser)
                      </label>
                    )}
                  />
                </div>
                {autreCauseCoche && (
                  <div className="mt-3">
                    <Input
                      placeholder="Précisez la cause..."
                      {...register("causes.autrePrecision")}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Field
                  label="Indiquer, parmi les difficultés rencontrées, celles relevant de facteurs maîtrisables par l'équipe projet (facteurs internes...)"
                  htmlFor="difficultesMaitrisables"
                >
                  <Textarea
                    id="difficultesMaitrisables"
                    rows={2}
                    {...register("difficultesMaitrisables")}
                  />
                </Field>
                <Field
                  label="Indiquer, parmi les difficultés rencontrées, celles relevant de facteurs non maîtrisables par l'équipe projet (facteurs externes, dépendances...)"
                  htmlFor="difficultesNonMaitrisables"
                >
                  <Textarea
                    id="difficultesNonMaitrisables"
                    rows={2}
                    {...register("difficultesNonMaitrisables")}
                  />
                </Field>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Chiffres clés
                </p>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-end gap-3 sm:grid-cols-[1fr_5rem_1.5fr]">
                    <Field label="Écart marge actuel">
                      <Input type="number" step="0.1" {...register("ecartMargePct")} />
                    </Field>
                    <p className="pb-2 text-sm text-muted-foreground">%</p>
                    <Field label="Commentaire">
                      <Input {...register("ecartMargeCommentaire")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-end gap-3 sm:grid-cols-[1fr_5rem_1.5fr]">
                    <Field label="Écart planning">
                      <Input
                        type="number"
                        step="0.5"
                        {...register("ecartPlanningJours")}
                      />
                    </Field>
                    <p className="pb-2 text-sm text-muted-foreground">jours</p>
                    <Field label="Commentaire">
                      <Input {...register("ecartPlanningCommentaire")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-end gap-3 sm:grid-cols-[1fr_5rem_1.5fr]">
                    <Field label="Charge réévaluée vs prévue">
                      <Input
                        type="number"
                        step="0.1"
                        {...register("chargeReevalueePct")}
                      />
                    </Field>
                    <p className="pb-2 text-sm text-muted-foreground">%</p>
                    <Field label="Commentaire">
                      <Input {...register("chargeReevalueeCommentaire")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-end gap-3 sm:grid-cols-[1fr_5rem_1.5fr]">
                    <Field label="Pourcentage avancement projet">
                      <Input type="number" step="1" {...register("avancementPct")} />
                    </Field>
                    <p className="pb-2 text-sm text-muted-foreground">%</p>
                    <Field label="Commentaire">
                      <Input {...register("avancementCommentaire")} />
                    </Field>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs Visuels</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Statut global
                </p>
                <Controller
                  control={control}
                  name="statutGlobal"
                  render={({ field }) => (
                    <TonePicker
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "CRITIQUE", label: STATUT_GLOBAL_LABELS.CRITIQUE, tone: "critique" },
                        { value: "WARNING", label: STATUT_GLOBAL_LABELS.WARNING, tone: "red" },
                        { value: "SOUS_CONTROLE", label: STATUT_GLOBAL_LABELS.SOUS_CONTROLE, tone: "amber" },
                        { value: "OK", label: STATUT_GLOBAL_LABELS.OK, tone: "green" },
                      ]}
                    />
                  )}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {STATUT_GLOBAL_LEGENDE}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Relation client
                </p>
                <Controller
                  control={control}
                  name="relationClient"
                  render={({ field }) => (
                    <TonePicker
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "DEGRADEE", label: RELATION_CLIENT_LABELS.DEGRADEE, tone: "red" },
                        { value: "TENDUE", label: RELATION_CLIENT_LABELS.TENDUE, tone: "amber" },
                        { value: "SAINE", label: RELATION_CLIENT_LABELS.SAINE, tone: "green" },
                      ]}
                    />
                  )}
                />
                <Textarea
                  className="mt-2"
                  placeholder="Commentaire (max 2 lignes)"
                  rows={2}
                  {...register("relationClientCommentaire")}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Météo équipe
                </p>
                <Controller
                  control={control}
                  name="meteoEquipe"
                  render={({ field }) => (
                    <TonePicker
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "DESENGAGEMENT", label: METEO_EQUIPE_LABELS.DESENGAGEMENT, tone: "red" },
                        { value: "FRAGILE", label: METEO_EQUIPE_LABELS.FRAGILE, tone: "amber" },
                        { value: "ENGAGEE", label: METEO_EQUIPE_LABELS.ENGAGEE, tone: "green" },
                      ]}
                    />
                  )}
                />
                <Textarea
                  className="mt-2"
                  placeholder="Signaux faibles (turnover, fatigue, conflits...)"
                  rows={2}
                  {...register("signauxFaibles")}
                />
                <Field
                  label="Veuillez préciser si des départs clés (Tech Lead, chef de projet, etc.) ont eu lieu au cours de la dernière période"
                  htmlFor="departsCles"
                >
                  <Textarea
                    id="departsCles"
                    rows={2}
                    {...register("departsCles")}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan d&apos;Action &amp; Trajectoire</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Plan de remédiation défini ?">
              <Controller
                control={control}
                name="planRemediationDefini"
                render={({ field }) => (
                  <TonePicker
                    value={field.value ? "OUI" : "NON"}
                    onChange={(v) => field.onChange(v === "OUI")}
                    options={[
                      { value: "OUI", label: "Oui", tone: "green" },
                      { value: "NON", label: "Non", tone: "red" },
                    ]}
                  />
                )}
              />
            </Field>
            <Field label="Si oui, statut du plan">
              <Controller
                control={control}
                name="statutPlan"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner...">
                        {(value: string) =>
                          value ? STATUT_PLAN_LABELS[value as (typeof STATUT_PLAN)[number]] : "Sélectionner..."
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUT_PLAN.map((value) => (
                        <SelectItem key={value} value={value}>
                          {STATUT_PLAN_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Actions prioritaires (3 max)
            </p>
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                  <Field label={`Action ${i + 1}`}>
                    <Input {...register(`actions.${i}.action` as const)} />
                  </Field>
                  <Field label="Responsable">
                    <Input {...register(`actions.${i}.responsable` as const)} />
                  </Field>
                  <Field label="Échéance">
                    <Input type="date" {...register(`actions.${i}.echeance` as const)} />
                  </Field>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Risques majeurs (top 3)
            </p>
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                  <Field label={`Risque ${i + 1}`}>
                    <Input {...register(`risques.${i}.description` as const)} />
                  </Field>
                  <Field label="Impact">
                    <Controller
                      control={control}
                      name={`risques.${i}.impact` as const}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="...">
                              {(value: string) =>
                                value ? IMPACT_LABELS[value as (typeof IMPACT)[number]] : "..."
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {IMPACT.map((value) => (
                              <SelectItem key={value} value={value}>
                                {IMPACT_LABELS[value]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Probabilité">
                    <Controller
                      control={control}
                      name={`risques.${i}.probabilite` as const}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="...">
                              {(value: string) =>
                                value
                                  ? PROBABILITE_LABELS[value as (typeof PROBABILITE)[number]]
                                  : "..."
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {PROBABILITE.map((value) => (
                              <SelectItem key={value} value={value}>
                                {PROBABILITE_LABELS[value]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Besoins de support Hub Tech
            </p>
            <div className="flex flex-col gap-3">
              {BESOIN_SUPPORT_KEYS.map((key, i) => (
                <div
                  key={key}
                  className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_2fr]"
                >
                  <Controller
                    control={control}
                    name={`besoinsSupport.${i}.applicable` as const}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        {BESOIN_SUPPORT_LABELS[key]}
                      </label>
                    )}
                  />
                  <Input
                    placeholder="Commentaire"
                    {...register(`besoinsSupport.${i}.commentaire` as const)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intelligence Artificielle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="L'IA est-elle utilisée sur votre projet ?">
              <Controller
                control={control}
                name="iaUtilisee"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string) =>
                          IA_UTILISEE_LABELS[value as (typeof IA_UTILISEE)[number]]
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {IA_UTILISEE.map((value) => (
                        <SelectItem key={value} value={value}>
                          {IA_UTILISEE_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Quel gain estimez-vous obtenir grâce à l'IA sur votre projet ?">
              <Controller
                control={control}
                name="iaGainEstime"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string) =>
                          GAIN_IA_LABELS[value as (typeof GAIN_IA)[number]]
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {GAIN_IA.map((value) => (
                        <SelectItem key={value} value={value}>
                          {GAIN_IA_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Sur quelles phases du projet l&apos;IA est-elle utilisée ?
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {IA_PHASE_KEYS.map((key) => (
                <Controller
                  key={key}
                  control={control}
                  name={`iaPhases.${key}`}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      {IA_PHASE_LABELS[key]}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <Field label="Quel est le principal cas d'usage IA ayant apporté de la valeur sur votre projet ?">
            <Input
              placeholder="Réponse courte"
              {...register("iaCasUsagePrincipal")}
            />
          </Field>

          <Field label="Quel est aujourd'hui le principal frein à une utilisation plus importante de l'IA ?">
            <Controller
              control={control}
              name="iaFrein"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        FREIN_IA_LABELS[value as (typeof FREIN_IA)[number]]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FREIN_IA.map((value) => (
                      <SelectItem key={value} value={value}>
                        {FREIN_IA_LABELS[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </CardContent>
      </Card>
    </form>
  );
}
