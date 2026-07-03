import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Fiche } from "@/lib/generated/prisma/client";
import { FICHE_STATUT_LABELS } from "@/lib/fiche-statut";
import { formatPeriodeFr } from "@/lib/periode";
import {
  BESOIN_SUPPORT_LABELS,
  CAUSE_KEYS,
  CAUSE_LABELS,
  FREIN_IA_LABELS,
  GAIN_IA_LABELS,
  IA_PHASE_KEYS,
  IA_PHASE_LABELS,
  IA_UTILISEE_LABELS,
  IMPACT_LABELS,
  METEO_EQUIPE_LABELS,
  PHASE_LABELS,
  PROBABILITE_LABELS,
  RELATION_CLIENT_LABELS,
  STATUT_GLOBAL_LABELS,
  STATUT_PLAN_LABELS,
  TYPE_PROJET_LABELS,
  type ActionItem,
  type BesoinSupportItem,
  type Causes,
  type IaPhases,
  type RisqueItem,
} from "@/lib/validations/fiche";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 2 },
  subtitle: { fontSize: 10, color: "#6b7280", marginBottom: 10 },
  badge: {
    fontSize: 9,
    color: "#b45309",
    backgroundColor: "#fffbeb",
    padding: 6,
    marginBottom: 12,
    borderBottom: "1pt solid #fde68a",
  },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: "1pt solid #e5e7eb",
  },
  row: { flexDirection: "row", marginBottom: 6 },
  col: { flex: 1, paddingRight: 8 },
  fullField: { marginBottom: 6 },
  label: { fontSize: 8, color: "#6b7280", marginBottom: 1 },
  value: { fontSize: 10, marginBottom: 4 },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid #e5e7eb", paddingVertical: 3 },
  tableCell: { flex: 1, fontSize: 9, paddingRight: 4 },
});

// La police PDF (Helvetica) n'a pas de glyphes pour les emoji utilisés dans
// les libellés à l'écran (🟢/🟠/🔴...) : on les retire pour éviter les
// caractères cassés à l'impression.
function stripEmoji(text: string): string {
  return text.replace(/\p{Extended_Pictographic}/gu, "").trim();
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || value === 0 ? String(value) : "—"}</Text>
    </View>
  );
}

// Variante pleine largeur, à utiliser hors d'un styles.row (le style `col`
// de Field a flex:1, ce qui ne fonctionne que sur l'axe d'un conteneur row).
function FullField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.fullField}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || value === 0 ? String(value) : "—"}</Text>
    </View>
  );
}

export function FichePdfDocument({
  fiche,
  historisee,
}: {
  fiche: Fiche;
  historisee: boolean;
}) {
  const causes = fiche.causes as Causes;
  const actions = (fiche.actions as ActionItem[]).filter((a) => a.action);
  const risques = (fiche.risques as RisqueItem[]).filter((r) => r.description);
  const besoinsSupport = (fiche.besoinsSupport as BesoinSupportItem[]).filter((b) => b.applicable);
  const iaPhases = fiche.iaPhases as IaPhases;

  const causesCochees = CAUSE_KEYS.filter((key) => causes[key]).map((key) => CAUSE_LABELS[key]);
  if (causes.autre) causesCochees.push(`Autre : ${causes.autrePrecision || "—"}`);

  const iaPhasesCochees = IA_PHASE_KEYS.filter((key) => iaPhases[key]).map(
    (key) => IA_PHASE_LABELS[key],
  );

  return (
    <Document title={`Fiche ${fiche.projet} — ${formatPeriodeFr(fiche.periode)}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Fiche de Suivi Projet — {fiche.projet}</Text>
        <Text style={styles.subtitle}>
          {fiche.client} · Période {formatPeriodeFr(fiche.periode)} · Statut{" "}
          {FICHE_STATUT_LABELS[fiche.statut]}
        </Text>
        {historisee && (
          <Text style={styles.badge}>
            Fiche historisée (mois clos) — conservée en lecture seule.
          </Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A. Informations générales</Text>
          <View style={styles.row}>
            <Field
              label="Date de mise à jour"
              value={fiche.dateMiseAJour.toLocaleDateString("fr-FR")}
            />
            <Field label="Type d'engagement" value={TYPE_PROJET_LABELS[fiche.typeProjet]} />
            <Field label="Phase actuelle" value={PHASE_LABELS[fiche.phaseActuelle]} />
          </View>
          <View style={styles.row}>
            <Field label="Responsable pilotage" value={fiche.responsablePilotage} />
            <Field label="Email responsable" value={fiche.responsableEmail} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>B. Indicateurs visuels clés</Text>
          <View style={styles.row}>
            <Field
              label="Statut global"
              value={stripEmoji(STATUT_GLOBAL_LABELS[fiche.statutGlobal])}
            />
            <Field
              label="Relation client"
              value={stripEmoji(RELATION_CLIENT_LABELS[fiche.relationClient])}
            />
            <Field
              label="Météo équipe"
              value={stripEmoji(METEO_EQUIPE_LABELS[fiche.meteoEquipe])}
            />
          </View>
          {fiche.relationClientCommentaire && (
            <FullField
              label="Commentaire relation client"
              value={fiche.relationClientCommentaire}
            />
          )}
          {fiche.signauxFaibles && (
            <FullField label="Signaux faibles" value={fiche.signauxFaibles} />
          )}
          {fiche.departsCles && <FullField label="Départs clés" value={fiche.departsCles} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>C. Compréhension de la dérive</Text>
          <FullField
            label="Causes principales"
            value={causesCochees.length ? causesCochees.join(", ") : undefined}
          />
          {fiche.difficultesMaitrisables && (
            <FullField label="Difficultés maîtrisables" value={fiche.difficultesMaitrisables} />
          )}
          {fiche.difficultesNonMaitrisables && (
            <FullField
              label="Difficultés non maîtrisables"
              value={fiche.difficultesNonMaitrisables}
            />
          )}
          <View style={styles.row}>
            <Field
              label="Écart marge"
              value={fiche.ecartMargePct !== null ? `${fiche.ecartMargePct} %` : undefined}
            />
            <Field
              label="Écart planning"
              value={fiche.ecartPlanningJours !== null ? `${fiche.ecartPlanningJours} j` : undefined}
            />
            <Field
              label="Charge réévaluée"
              value={
                fiche.chargeReevalueePct !== null ? `${fiche.chargeReevalueePct} %` : undefined
              }
            />
            <Field
              label="Avancement"
              value={fiche.avancementPct !== null ? `${fiche.avancementPct} %` : undefined}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>D. Plan d&apos;action &amp; trajectoire</Text>
          <View style={styles.row}>
            <Field
              label="Plan de remédiation défini"
              value={fiche.planRemediationDefini ? "Oui" : "Non"}
            />
            <Field
              label="Statut du plan"
              value={fiche.statutPlan ? STATUT_PLAN_LABELS[fiche.statutPlan] : undefined}
            />
          </View>

          <Text style={styles.label}>Actions prioritaires</Text>
          {actions.length > 0 ? (
            actions.map((a, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{a.action}</Text>
                <Text style={styles.tableCell}>{a.responsable || "—"}</Text>
                <Text style={styles.tableCell}>{a.echeance || "—"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.value}>—</Text>
          )}

          <Text style={[styles.label, { marginTop: 6 }]}>Risques majeurs</Text>
          {risques.length > 0 ? (
            risques.map((r, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{r.description}</Text>
                <Text style={styles.tableCell}>{r.impact ? IMPACT_LABELS[r.impact] : "—"}</Text>
                <Text style={styles.tableCell}>
                  {r.probabilite ? PROBABILITE_LABELS[r.probabilite] : "—"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.value}>—</Text>
          )}

          <Text style={[styles.label, { marginTop: 6 }]}>Besoins de support Hub Tech</Text>
          {besoinsSupport.length > 0 ? (
            besoinsSupport.map((b) => (
              <Text key={b.besoin} style={styles.value}>
                • {BESOIN_SUPPORT_LABELS[b.besoin]}
                {b.commentaire ? ` — ${b.commentaire}` : ""}
              </Text>
            ))
          ) : (
            <Text style={styles.value}>—</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E. Intelligence Artificielle</Text>
          <View style={styles.row}>
            <Field label="IA utilisée" value={IA_UTILISEE_LABELS[fiche.iaUtilisee]} />
            <Field label="Gain estimé" value={GAIN_IA_LABELS[fiche.iaGainEstime]} />
          </View>
          <FullField
            label="Phases concernées"
            value={iaPhasesCochees.length ? iaPhasesCochees.join(", ") : undefined}
          />
          {fiche.iaCasUsagePrincipal && (
            <FullField label="Cas d'usage principal" value={fiche.iaCasUsagePrincipal} />
          )}
          <FullField
            label="Frein principal"
            value={`${FREIN_IA_LABELS[fiche.iaFrein]}${
              fiche.iaFreinCommentaire ? ` — ${fiche.iaFreinCommentaire}` : ""
            }`}
          />
        </View>
      </Page>
    </Document>
  );
}
